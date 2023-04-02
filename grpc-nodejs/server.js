const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, query, where, updateDoc, doc, setDoc, deleteDoc, getDoc, getDocs, addDoc } = require("firebase/firestore");

const firebaseConfig = {
  // Isi dengan konfigurasi dari Firebase Anda
  apiKey: "AIzaSyCq5cb7VXhZwBGpAxrKoY2qPxjM-aCGL8Y",
  authDomain: "pi-grpc.firebaseapp.com",
  projectId: "pi-grpc",
  storageBucket: "pi-grpc.appspot.com",
  messagingSenderId: "241562043645",
  appId: "1:241562043645:web:28e2e5045ab678e87faa94"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Define Proto path 
const PROTO_PATH = './todolist.proto';

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

// Load Proto 
const todoProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

// Add service in proto 
server.addService(todoProto.ToDoService.service, {
  // Create
  addToDo: (call, callback) =>  {
    const _todo = { ...call.request };
    const todoRef = collection(db, "todo");
    addDoc(todoRef, _todo)
      .then((docRef) => {
        const addedToDo = { id: docRef.id, ..._todo };
        callback(null, addedToDo);
      })
      .catch((error) => callback(error, null));
  },


  getAll: (call, callback) => {
    const todoCollection = collection(db, 'todo');
    const todoQuery = query(todoCollection);
    
    getDocs(todoQuery).then((snapshot) => {
      const todo = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        todo.push({
          id: doc.id,
          matkul: data.matkul,
          ket: data.ket,
          deadline: data.deadline
        });
      });
      callback(null, { todo });
    }).catch((error) => {
      console.error(error);
      callback(error, null);
    });
  },

  // Read
  getToDo: (call, callback) => {
    const id = call.request.id;
    const todoRef = doc(db, "todo", id);
    getDoc(todoRef)
      .then((doc) => {
        if (doc.exists()) {
          callback(null, doc.data());
        } else {
          callback(`ID ${id} tidak ditemukan`, null);
        }
      })
      .catch((error) => callback(error, null));
  },

  // Update
  editToDo: (call, callback) => {
    const id = call.request.id;
    const todoRef = doc(db, "todo", id);
    const updatedToDo = {
      matkul: call.request.matkul,
      ket: call.request.ket,
      deadline: call.request.deadline
    };
    updateDoc(todoRef, updatedToDo)
      .then(() => callback(null, updatedToDo))
      .catch((error) => callback(error, null));
  },

  // Delete
  deleteToDo: (call, callback) => {
    const id = call.request.id;
    const todoRef = doc(db, "todo", id);
    deleteDoc(todoRef)
      .then(() => callback(null, { message: `ID ${id} berhasil dihapus` }))
      .catch((error) => callback(error, null));
  }
});

// Start server 
server.bindAsync(
  "127.0.0.1:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Server running at http://127.0.0.1:50051");
    server.start();
  }
)