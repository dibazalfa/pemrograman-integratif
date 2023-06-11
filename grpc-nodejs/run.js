const client = require("./client");
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


console.log("Halo! Apa yang ingin kamu lakukan?")
console.log("1. Tambahkan Data")
console.log("2. Lihat Seluruh Data")
console.log("3. Mencari Data")
console.log("4. Mengedit Data")
console.log("5. Menghapus Data")

rl.question('Masukkan Nomor: ', (nomor) => {

if(nomor == 1) {
  // add todo
  rl.question('Nama Mata Kuliah: ', (matkul) => {

    rl.question('Tambahkan Keterangan: ', (ket) => {

      rl.question('Deadline: ', (deadline) => {
          // melakukan penambahan data ke firestore
          client.addToDo({
            matkul: matkul,
            ket: ket,
            deadline: deadline,
          }, (error, todo) => {
            if (!error) {
              console.log('Data berhasil ditambahkan');
              console.log(todo);
            } else {
              console.error(error);
            }
            rl.close();
          });
        });
      });
    });
} else if(nomor == 2) {
  // read all data yg ada 
    client.getAll({}, (error, todo) => {
    if (!error) {
      console.log('Berikut adalah data yang ada')
      console.log(todo)
    } else {
      console.error(error)
    }
    rl.close();
  })
} else if(nomor == 3) {
  // read todo 
  rl.question('Masukkan ID yang dicari: ', (id) => {
      console.log(`Halo, ${id}!`);

        client.getToDo(
          {
            id: id
          }, 
          (error, todo) => {
            if (!error) {
              console.log('Ini data yang kamu cari')
              console.log(todo)
            } else {
              console.error(error)
            }
          }
        )
        rl.close();
  });
} else if(nomor == 4) {
  // edit todo
  rl.question('Masukkan ID data yang ingin diedit: ', (id) => {

    rl.question('Edit mata kuliah: ', (matkul) => {

      rl.question('Edit keterangan: ', (ket) => {

        rl.question('Edit deadline: ', (deadline) => {

          client.editToDo(
            {
              id: id,
              matkul: matkul,
              ket: ket,
              deadline: deadline,
            },
            (error, todo) => {
              if (!error) {
                console.log('Data berhasil diedit')
                console.log(todo)
              } else {
                console.error(error)
              }
            }
          )
          rl.close();
        });
      });
    });
  });
} else if(nomor == 5) {
  // delete todo
  rl.question('Masukkan ID data yang ingin dihapus: ', (id) => {

      client.deleteToDo(
        {
          id: id
        }, 
        (error, todo) => {
          if (!error) {
            console.log('Data berhasil dihapus')
            console.log(todo)
          } else {
            console.error(error)
          }
        }
      )
      rl.close();
  });
} else {
  console.log("Inputan yang dimasukkan salah")
  rl.close();
}

});
