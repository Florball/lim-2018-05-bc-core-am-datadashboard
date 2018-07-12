// objeto para llamar al json
let urlCohort = '../data/cohorts.json';
let urlUser = '../data/cohorts/lim-2018-03-pre-core-pw/users.json';
let urlProgress = '../data/cohorts/lim-2018-03-pre-core-pw/progress.json';
let ServiceApiRequest = (url, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
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
let btnLogin= document.getElementById('logging');
// declarando divs para ocultar
const firstTab = document.getElementById('first-tab');
const secondTab = document.getElementById('second-tab');
const sectionList = document.getElementById('side-list');
const thirdTab = document.getElementById('third-tab');
// declarando ul
const menuSedes = document.getElementById('menu-sedes');
const ulCohorts = document.getElementById('lista-cohorts');
const ulStudents = document.getElementById('list-students');
const progressDetail = document.getElementById('progress-detail');
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
btnLogin = document.addEventListener('click', (event) => {
  if (document.form.password.value === 'CONTRASEÑA' && document.form.user.value === 'USUARIO') {
    window.location='main.html'; 
  } else {
    alert('Por favor ingrese el nombre de usuario y la contraseña correcta.')
  };
});
// funcion para ocultar tabs
const hideTabs = (tab1, tab2, tab3 = '', tab4 = '') => {
  tab1.classList.replace('show', 'hide');
  tab2.classList.replace('hide', 'show');
  if (tab3 != '') {
    tab3.classList.replace('hide', 'show');
  } else if (tab4 != '') {
    tab4.classList.replace('show', 'hide');
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

let createDivconteiner=(title,classDivConteiner,listaData) =>{
  const divElemnt = document.createElement('div');
  const ulElemnt = document.createElement('ul');
  divElemnt.setAttribute('class',classDivConteiner)
  divElemnt.innerHTML = title;
  for (let item in listaData) {
    let liElemnt = document.createElement('li');
    liElemnt.setAttribute('class','li-title');
    liElemnt.innerHTML = item +" : "+ listaData[item]
    ulElemnt.appendChild(liElemnt);
  }
   divElemnt.appendChild(ulElemnt);
   return divElemnt;
};

// funcion para crear listas de estudiantes
let createListUser = (ulId, classLi, element, html) => {
  const list = document.getElementById(ulId);
  const elementLi = document.createElement('li');
  const contenedor = document.createElement('div');
  const spanName = document.createElement('span');
  const divpercent = document.createElement('div');
  /*
  const ulElemnt = document.createElement('ul');
  const liElemnt = document.createElement('li');
  */
  spanName.innerHTML = html  
  elementLi.setAttribute('id', element.id);
  elementLi.setAttribute('class', classLi);  
  divpercent.setAttribute('class', 'li-conteiner');
  divpercent.innerHTML = 'Porcentaje Total :'+ element.stats.percent;
  const contenLis = document.createElement('div');
  contenLis.setAttribute('class','conteiner');
  contenLis.appendChild(createDivconteiner('Ejercicios:','li-conteine',element.stats.exercises));
  contenLis.appendChild(createDivconteiner('Reads:','li-conteine',element.stats.reads));
  contenLis.appendChild(createDivconteiner('Quizzes:','li-conteine',element.stats.quizzes));
  contenedor.appendChild(spanName);
  contenedor.appendChild(divpercent);
  contenedor.appendChild(contenLis);
  elementLi.appendChild(contenedor);
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
        createList('lista-cohorts', 'elem-cohort', cohort, cohort.id);
      };
    });
  });
};
menuSedes.addEventListener('click', (event) => {
  ServiceApiRequest(urlProgress, () => {
    listProgress.setProgres(getProgress());
  });

  listOfCohorts(event.target.id);
});
optionPromocion.addEventListener('click', (event) => {

  listOfCohorts(event.target.id);
});
// funcion para listar estudiantes
const listOfStudent = (n) => {
  ServiceApiRequest(urlUser, () => {
    hideTabs(sectionList, thirdTab);
    listUser.setUsers(getUsers());
    let Lis = computeUsersStats(listUser.getNewUsers(), listProgress.getNewProgress(), listCohort.getCourses());
    Lis.forEach(student => {
      options.cohortData.users.push(student);
      if (student.signupCohort === n) {
        if (student.role == 'student') {
          createListUser('list-students', 'elem-student', student, student.name);
        };
      };
    });
  });
};
ulCohorts.addEventListener('click', (event) => {
  options.cohort.forEach(cohort => {
    if (cohort.id === event.target.id) {
      options.cohort = cohort;
    }
  });
  ServiceApiRequest(urlProgress, () => {
    listProgress.setProgres(getProgress());
  });
  listOfStudent(event.target.id);
  //listOfProgress();
});
optionEstudiantes.addEventListener('click', (event) => {
  ServiceApiRequest(urlProgress, () => {
    listProgress.setProgres(getProgress());
  });
  listOfStudent(event.target.id);
});
// funcion para filtrar usuarios
const filter = (value) => {
  ServiceApiRequest(urlUser, () => {
    let Lis = computeUsersStats(listUser.getNewUsers(), listProgress.getNewProgress(), listCohort.getCourses());

    listUser.setUsers(filterUsers(Lis, value));
    ulStudents.innerHTML = '';
 
    listUser.getNewUsers().forEach(student => {
      if (student.role === 'student') {
        createListUser('list-students', 'elem-student', student, student.name);
      };
    });
  });
};
search.addEventListener('keyup', (event) => {
  filter(event.target.value);
});
// funcion para ordenar asc y desc 
desc.addEventListener('click', (event) => {
  let orderBy = document.getElementById('orderBy').value;
  let user = computeUsersStats(listUser.getNewUsers(), listProgress.getNewProgress(), listCohort.getCourses());

  sortUsers(user, orderBy, 'desc');
  ulStudents.innerHTML = '';
  user.forEach(student => {
    if (student.role === 'student') {
      createListUser('list-students', 'elem-student', student, student.name);
    };
  });
});
asc.addEventListener('click', (event) => {
  let orderBy = document.getElementById('orderBy').value;
  let user = computeUsersStats(listUser.getNewUsers(), listProgress.getNewProgress(), listCohort.getCourses());
  sortUsers(user, orderBy, 'asc');
  ulStudents.innerHTML = '';
  user.forEach(student => {
    if (student.role === 'student') {
      createListUser('list-students', 'elem-student', student, student.name);
    };
  });
});
