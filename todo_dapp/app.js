import getContract, {signerProvider, signerA} from "./utils/getContract.js";


async function getTodoList() {
  const contract = getContract();
  console.log(contract);

  try {
    let address = await signerA.getAddress();
    document.getElementById("connectedWallet").innerText = address;
    // console.log(address, "new address");
    const response = await contract.getTodos();
    const arr = response.filter((item) => Object.keys(item).length);
    const formatted = arr.map((item) => {
      return {
        name: item[0],
        description: item[1],
        status: item[2]
      };
      
    });
    return formatted.filter(i =>Boolean(i.name));
  } catch (error) {
    console.log("error found", error);
  }
}

getTodoList();

async function updateTodoDetails(id) {
  await connectWallet();
  var newTitle = document.getElementById('newTitle').value;
  var newDesc = document.getElementById('newDesc').value;
  if (newTitle != '' || newDesc != '' ) {
    const contract = getContract(true);

    try {
      const response = await contract.updateTodo(id, newTitle, newDesc);
      await response.wait();
      // console.log(response);
      console.log('update successful');
    } catch (error) {
      console.log("error", error);
    }
  }else{
    alert('Fill todo details appropriately');
  }
}

$(document).on('click', '#updateBtn', function(){
  var rid=$(this).val();
  $('#updateTodoModal').modal('show');
  $('.modal-footer #confirmTodoUpdate').val(rid);
});

$(document).on('click', '#confirmTodoUpdate', async function(){
  var id=$(this).val();
  $('#updateTodoModal').modal('hide');
  $('body').removeClass('modal-open');
  $('.modal-backdrop').remove();

  await connectWallet();
  var newTitle = document.getElementById('newTitle').value;
  var newDesc = document.getElementById('newDesc').value;
  if (newTitle != '' || newDesc != '' ) {
    const contract = getContract(true);

    try {
      const response = await contract.updateTodo(id, newTitle, newDesc);
      await response.wait();
      console.log(response);
      alert('update successful');
    } catch (error) {
      console.log("error", error);
    }
  }else{
    alert('Fill todo details appropriately');
  }
    
});


const updateTodoUI = async () => {
  const data = await getTodoList();

  // const info = data.map((item) => {
  //   return (`
  //    <li class="my-2">${item.description}</li>
  //   `)
  // });
  // console.log(info);
  // todos.innerHTML += info.join("");

  // or 

  data.forEach((item, index) => {
    console.log(item)    
    todos.innerHTML += `
    <li class="my-2">
    <div class="flex place-content-between align-center my-4">
      <div class="w-full">
        <div class="form-check">
          <input class="form-check-input h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" value=${item.status,index} id="statusBtn" >
        </div>
        ${item.name}: ${item.description}
    </div>
        <div class="flex">
          <button class="border border-blue-600 bg-blue-600 text-white p-4 py-1 mx-auto text-center block mr-2" value=${index} data-toggle="modal" id="updateBtn" data-target=edit>
            Edit
          </button>
          <button class="border border-red-600 bg-red-600 text-white p-4 py-1 mx-auto text-center block" value=${index} id="deleteBtn">
            Delete
          </button>
        </div>
    </div>
    </li>
   `
  })
}

updateTodoUI()

const connectWallet = async () => {
  await signerProvider.send("eth_requestAccounts");
};

let btn = document.getElementById("btn");
btn.addEventListener("click", createTodo);

async function createTodo() {
  const contract = getContract(true);
  try {
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    const response = await contract.createTodo(title, description);
    const confirm = response.wait();
  } catch (error) {
    console.log("error found");
  }

}



$(document).on('click', '#deleteBtn', async function () {
  var id=$(this).val();
  const contract = getContract(true);
  try {
    const response = await contract.deleteTodo(id);
    const confirm = await response.wait();
    console.log(confirm)
  } catch (error) {
    console.log("error found");
  }

});


$(document).on('click', '#statusBtn', async function (e) {
  var id = $(this).val();
  const contract = getContract(true);
  try {
    const response = await contract.updateTodoStatus(id);
    const confirm = await response.wait();
    console.log(confirm)
    if (e.traget.checked === true){
      console.log("Checkbox is checked - boolean value: ", e.target.checked)
    }
    if(e.target.checked === false) {
      console.log("Checkbox is not checked - boolean value: ", e.target.checked)
    }
  } catch (error) {
    console.log("error found");
  }

});
