// declarando variable DE BOTON
let btnLogging = document.getElementById('logging');
const firstTab = document.getElementById('first-tab');
const secondTab = document.getElementById('second-tab');
const optionSedes = document.getElementById('option1');
const optionPromocion = document.getElementById('option2');
const optionEstudiantes = document.getElementById('option3');
const menuSedes = document.getElementById('menu-sedes');
const ulCohorts = document.getElementById("lista-cohorts");
const ulStudents = document.getElementById("list-students")
const search = document.getElementById('my-search')
// funcion para ocultar tabs
const hideTabs = (tab1, tab2, tab3) => {
  tab1.classList.replace("show", "hide");
  tab2.classList.replace("hide", "show");
  tab3.classList.replace("hide", "show");
}
// funcion para agregar evento a logging
btnLogging = (event) => {
  if (document.form.password.value === 'CONTRASEÑA' && document.form.user.value === 'USUARIO') {
    continue;
  } else {
    event.preventDefault(); // Evita que accedan a la página sin contraseña
    alert("Por favor ingrese el nombre de usuario y la contraseña correcta.");
  };
};
let createList = (ulId, classLi, element, html) => {
  const list = document.getElementById(ulId);
  const elementLi = document.createElement('li');
  elementLi.setAttribute('id', element.id);
  elementLi.setAttribute('class', classLi);
  elementLi.innerHTML = html;
  list.appendChild(elementLi);
}

const listOfCohorts = (id) => {
  // funcion para obtener lista de cohorts/promociones
  ServiceApiRequest(urlCohort, () => {
    hideTabs(firstTab, secondTab, secondTab)
    // for of que recorre array de json cohorts
    listCohort.setCohort(getCohorts());
    listCohort.getNewCohort().forEach(cohort => {
      if (cohort.id.startsWith(id)) {

        createList("lista-cohorts", 'elem-cohort', cohort, cohort.id)
      }
    })
  });
}

menuSedes.addEventListener("click", (event) => {
  listOfCohorts(event.target.id)
})

const listOfStudent = (n) => {
  ServiceApiRequest(urlUser, () => {
    listUser.setUsers(getUsers());
    // for of que recorre array de json cohorts
    listUser.getNewUsers().forEach(student => {
      if (student.signupCohort === n) {
        if (student.role == "student") {
          createList("list-students", 'elem-student', student, student.name)
        }
      }
    })
  });
}

ulCohorts.addEventListener("click", (event) => {
  
  listOfStudent(event.target.id)
  listOfProgress()

})

const filter = (value) => {
  ServiceApiRequest(urlUser, () => {
    listUser.setUsers(filterUsers(getUsers(), value))
    ulStudents.innerHTML = ''
    listUser.getNewUsers().forEach(student => {
      if (student.role == "student") {
        createList("list-students", 'elem-student', student, student.name)
      }
    })
  });
}

search.addEventListener("keyup", (event) => {
  filter(event.target.value)
})

const listOfProgress = () => {
  ServiceApiRequest(urlProgress, () => {
    listProgress.setProgres(getProgress());
    computeUsersStats(listUser.getNewUsers(), listProgress.getNewProgress(), listCohort.getCourses())
  })
}

ulStudents.addEventListener("click", (event) => {
  listOfProgress()
})

//let addEventListenerOrder=(listUser,listProgress,listCohort)=>{
  document.getElementById('desc').addEventListener("click", (event) => {
    let orderBy = document.getElementById('orderBy').value;
   let user = computeUsersStats(listUser.getNewUsers(), listProgress.getNewProgress(), listCohort.getCourses())
   console.log(orderBy)

   sortUsers(user,orderBy,'desc') 
   ulStudents.innerHTML = ''

   user.forEach(student => {
    if (student.role == "student") {
      createList("list-students", 'elem-student', student, student.name)
    }
  })
  })
  document.getElementById('asc').addEventListener("click", (event) => {
    let orderBy = document.getElementById('orderBy').value;
   let user = computeUsersStats(listUser.getNewUsers(), listProgress.getNewProgress(), listCohort.getCourses())
   
   sortUsers(user,orderBy,'asc') 
   ulStudents.innerHTML = ''
   user.forEach(student => {
    if (student.role == "student") {
      createList("list-students", 'elem-student', student, student.name)
    }
  })
  })
//}

  