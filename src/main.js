// objeto para llamar al json
let urlCohort = "../data/cohorts.json";
let urlUser = "../data/cohorts/lim-2018-03-pre-core-pw/users.json";
let urlProgress = "../data/cohorts/lim-2018-03-pre-core-pw/progress.json";
let ServiceApiRequest = (url, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onload = callback;
  xhr.send();
};
//  funciones para parsear la data
const getCohorts = () => {
  data1 = JSON.parse(event.target.responseText);
  return data1;
};
const getUsers = () => {
  data2 = JSON.parse(event.target.responseText);
  return data2;
};
const getProgress = () => {
  let data3 = JSON.parse(event.target.responseText);
  return data3;
};
// declarando variables 
let btnLogging = document.getElementById('logging');
// declarando divs para ocultar
const firstTab = document.getElementById('first-tab');
const secondTab = document.getElementById('second-tab');
const sectionList = document.getElementById("side-list");
const thirdTab = document.getElementById("third-tab");
// declarando ul
const menuSedes = document.getElementById('menu-sedes');
const ulCohorts = document.getElementById('lista-cohorts');
const ulStudents = document.getElementById('list-students');
const progressDetail = document.getElementById("progress-detail");
// declarando botones de menu 
const optionSedes = document.getElementById('option1');
const optionPromocion = document.getElementById('option2');
const optionEstudiantes = document.getElementById('option3');
// declarando input de filtrado
const search = document.getElementById('my-search');
// declarando variables de ordenado
const desc = document.getElementById('desc');
const asc = document.getElementById('asc');
// funcion para loguear
btnLogging = (event) => {
  if (document.form.password.value === 'CONTRASEÑA' && document.form.user.value === 'USUARIO') {
  } else {
    event.preventDefault();
    alert("Por favor ingrese el nombre de usuario y la contraseña correcta.");
  };
};
// funcion para ocultar tabs
const hideTabs = (tab1, tab2, tab3 = '', tab4 = '') => {
  tab1.classList.replace("show", "hide");
  tab2.classList.replace("hide", "show");
  if (tab3 != '') {
    tab3.classList.replace("hide", "show");
  } else if (tab4 != '') {
    tab4.classList.replace("show", "hide");
  };
};
// funcion para crear listas
let createList = (ulId, classLi, element, html) => {
  const list = document.getElementById(ulId);
  const elementLi = document.createElement('li');
  elementLi.setAttribute('id', element.id);
  elementLi.setAttribute('class', classLi);
  elementLi.innerHTML = html;
  list.appendChild(elementLi);
};
// objeto options
const options = {
  cohort: [],
  cohortData: {
    users: [],
    progress: [],
  },
  orderBy: 'name',
  orderDirection: 'asc',
  search: ''
};
// funcion para listar cohorts
const listOfCohorts = (id) => {
  ServiceApiRequest(urlCohort, () => {
    hideTabs(firstTab, secondTab, sectionList);
    listCohort.setCohort(getCohorts());
    listCohort.getNewCohort().forEach(cohort => {
      if (cohort.id.startsWith(id)) {
        options.cohort.push(cohort);
        createList("lista-cohorts", 'elem-cohort', cohort, cohort.id);
      };
    });
  });
};
menuSedes.addEventListener("click", (event) => {
  listOfCohorts(event.target.id);
});
optionPromocion.addEventListener("click", (event) => {
  listOfCohorts(event.target.id);
});
// funcion para listar estudiantes
const listOfStudent = (n) => {
  ServiceApiRequest(urlUser, () => {
    hideTabs(sectionList, thirdTab);
    listUser.setUsers(getUsers());
    listUser.getNewUsers().forEach(student => {
      options.cohortData.users.push(student);
      if (student.signupCohort === n) {
        if (student.role == "student") {
          createList("list-students", 'elem-student', student, student.name);
        };
      };
    });
  });
};
ulCohorts.addEventListener("click", (event) => {
  options.cohort.forEach(cohort => {
    if (cohort.id === event.target.id) {
      options.cohort = cohort;
    }
  });
  listOfStudent(event.target.id);
  listOfProgress();
});
optionEstudiantes.addEventListener("click", (event) => {
  listOfStudent(event.target.id);
});
// funcion para filtrar usuarios
const filter = (value) => {
  ServiceApiRequest(urlUser, () => {
    listUser.setUsers(filterUsers(getUsers(), value));
    ulStudents.innerHTML = '';
    listUser.getNewUsers().forEach(student => {
      if (student.role == "student") {
        createList("list-students", 'elem-student', student, student.name);
      };
    });
  });
};
search.addEventListener("keyup", (event) => {
  filter(event.target.value);
});
// funcion para mostrar progreso en pantalla
const listOfProgress = (id) => {
  ServiceApiRequest(urlProgress, () => {
    listProgress.setProgres(getProgress());
    options.cohortData.progress= listProgress.getNewProgress();
    processCohortData(options)
    progressDetail.innerHTML = '';
    let Lis = computeUsersStats(listUser.getNewUsers(), listProgress.getNewProgress(), listCohort.getCourses());
    objectUser = findUsers(Lis, id);
    const elementLi0 = document.createElement('span');
    Lis.forEach(element => {
      if (element.id === id )
      elementLi0.innerHTML = "Nombre : " + element.name
      progressDetail.appendChild(elementLi0);
    });
    const elementLi1 = document.createElement('span');
    elementLi1.innerHTML = "<p>"+"Porcentaje Total : " + objectUser.percent + "</p>";
    progressDetail.appendChild(elementLi1);
    const elementLi2 = document.createElement('span');
    elementLi2.innerHTML = "<p>" + "Ejercicios " + "</p>";
    progressDetail.appendChild(elementLi2);
    const elementLi3 = document.createElement('li');
    elementLi3.innerHTML = "Total de Ejercicios: " + objectUser.exercises.total;
    progressDetail.appendChild(elementLi3);
    const elementLi4 = document.createElement('li');
    elementLi4.innerHTML = "Total Completados: " + objectUser.exercises.completed;
    progressDetail.appendChild(elementLi4);
    const elementLi5 = document.createElement('li');
    elementLi5.innerHTML = "Porcentaje Completados:" + objectUser.exercises.percent;
    progressDetail.appendChild(elementLi5);
    const elementLi6 = document.createElement('span');
    elementLi6.innerHTML = "Reads: ";
    progressDetail.appendChild(elementLi6);
    const elementLi7 = document.createElement('li');
    elementLi7.innerHTML = "Total de Reads: " + objectUser.reads.total;
    progressDetail.appendChild(elementLi7);
    const elementLi8 = document.createElement('li');
    elementLi8.innerHTML = "Total Completados: " + objectUser.reads.completed;
    progressDetail.appendChild(elementLi8);
    const elementLi9 = document.createElement('li');
    elementLi9.innerHTML = "Porcentaje Completados: " + objectUser.reads.percent;
    progressDetail.appendChild(elementLi9);
    const elementLi10 = document.createElement('span');
    elementLi10.innerHTML = "Quizzes: ";
    progressDetail.appendChild(elementLi10);
    const elementLi11 = document.createElement('li');
    elementLi11.innerHTML = "Total de Quizzes: " + objectUser.quizzes.total;
    progressDetail.appendChild(elementLi11);
    const elementLi12 = document.createElement('li');
    elementLi12.innerHTML = "Total Completados: " + objectUser.quizzes.completed;
    progressDetail.appendChild(elementLi12);
    const elementLi13 = document.createElement('li');
    elementLi13.innerHTML = "Porcentaje Completados: " + objectUser.quizzes.percent;
    progressDetail.appendChild(elementLi13);
    const elementLi14 = document.createElement('li');
    elementLi14.innerHTML = "Puntaje Total: " + objectUser.quizzes.scoreSum;
    progressDetail.appendChild(elementLi14);
    const elementLi15 = document.createElement('li');
    elementLi15.innerHTML = "Promedio de Puntaje: " + objectUser.quizzes.scoreAvg;
    progressDetail.appendChild(elementLi15);
  });
};
ulStudents.addEventListener("click", (event) => {
listOfProgress(event.target.id)
});
// funcion para ordenar asc y desc 
desc.addEventListener("click", (event) => {
  let orderBy = document.getElementById('orderBy').value;
  let user = computeUsersStats(listUser.getNewUsers(), listProgress.getNewProgress(), listCohort.getCourses());
  sortUsers(user, orderBy, 'desc');
  ulStudents.innerHTML = '';
  user.forEach(student => {
    if (student.role == "student") {
      createList("list-students", 'elem-student', student, student.name);
    };
  });
});
asc.addEventListener("click", (event) => {
  let orderBy = document.getElementById('orderBy').value;
  let user = computeUsersStats(listUser.getNewUsers(), listProgress.getNewProgress(), listCohort.getCourses());
  sortUsers(user, orderBy, 'asc');
  ulStudents.innerHTML = '';
  user.forEach(student => {
    if (student.role == "student") {
      createList("list-students", 'elem-student', student, student.name);
    };
  });
});
