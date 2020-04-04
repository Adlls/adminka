
function renderViewUsers(data) {
    $(".getTableUsers").remove();
    let render = $(data);
    let found = $('.getTableUsers', render);
    $('.admin_content').append(found);
}

function isAdmin() {
    if ($(".role").text() !== "admin") {
        $(".delete_btn").remove();
        $(".update_btn").remove();
    }
}

document.getElementById("btn_view").addEventListener("click", function (e) {
    $('#addUser').css('display', 'none');
    $('form[name="updateUser"]').css('display', 'none');
    e.preventDefault();
    $.ajax({
        url: "users/",
        contentType: "application/json",
        method: "GET",
        success:  function(data) {
            $.ajax({
                url: "admin/",
                contentType: "application/json",
                data: {users: data},
                method: "GET",
                success:  function(data) {
                    renderViewUsers(data);
                    isAdmin();
                }
            });

        }
    });
});

document.getElementById("clear_btnAdd").addEventListener("click", function (e) {
    e.preventDefault();
    $('table.getTableUsers').css('display', 'none');
    $('#addUser').css('display', 'block');
    $('form[name="updateUser"]').css('display', 'none');
});

document.getElementById("btn_add").addEventListener("click", function (e) {
    e.preventDefault();
    let registerForm = document.forms["addUser"];
    let userName = registerForm.elements["name"].value;
    let login = registerForm.elements["login"].value;
    let pass = registerForm.elements["pass"].value;
    let email = registerForm.elements["email"].value;
    let phone = registerForm.elements["phone"].value;
    let role = registerForm.elements["role"].value;
    $.ajax({
        url: "http://localhost:3000/users/",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            name: userName,
            login: login,
            pass: pass,
            email: email,
            phone: phone,
            role: role
        }),
        success:  function(data)  {
            alert('Succsess add');
        }
    });
});

document.getElementById("btn_update").addEventListener("click", function (e) {
    e.preventDefault();
    let registerForm = document.forms["updateUser"];
    let userName = registerForm.elements["name"].value;
    let login = registerForm.elements["login"].value;
    let pass = registerForm.elements["pass"].value;
    let email = registerForm.elements["email"].value;
    let phone = registerForm.elements["phone"].value;
    let role = registerForm.elements["role"].value;
    let id = registerForm.elements["updateUser"].value;

    $.ajax({
        url: "http://localhost:3000/users/" + id,
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            name: userName,
            login: login,
            pass: pass,
            email: email,
            phone: phone,
            role: role
        }),
        success:  function(data)  {
            alert('Succsess update');
        }
    });

});


/*
document.getElementById("btn_add").addEventListener("click", function (e) {
    e.preventDefault();
    let registerForm = document.forms["addUser"];
    let userName = registerForm.elements["name"].value;
    let login = registerForm.elements["login"].value;
    let pass = registerForm.elements["pass"].value;
    let email = registerForm.elements["email"].value;
    let phone = registerForm.elements["phone"].value;
    let role = registerForm.elements["role"].value;

    // сериализуем данные в json
    let user = JSON.stringify({
        name: userName,
        login: login,
        pass: pass,
        email: email,
        phone: phone,
        role: role
    });
    let request = new XMLHttpRequest();
    request.open("GET", "localhost:3000/admin", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(user);
    request.addEventListener("load", function () {

       // let receivedUser = JSON.parse(request.response);
        //console.log(receivedUser.userName, "-", receivedUser.userAge);   // смотрим ответ сервера
        alert("added");
    });

});
*/