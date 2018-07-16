// objeto options
const options = {
  cohort: [],
  cohortData: {
    users: [],
    progress: [],
  },
  orderBy: '',
  orderDirection: '',
  search: ''
};
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
// funcion para crear divs que contengan la data de progreso
let createDivconteiner = (title, classDivConteiner, listaData) => {
  const divElemnt = document.createElement('div');
  const ulElemnt = document.createElement('ul');
  divElemnt.setAttribute('class', classDivConteiner)
  divElemnt.innerHTML = title;
  for (let item in listaData) {
    let liElemnt = document.createElement('li');
    liElemnt.setAttribute('class', 'li-title');
    liElemnt.innerHTML = item + " : " + listaData[item]
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
  spanName.setAttribute("class", "names")
  const divpercent = document.createElement('div');
  const contenLis = document.createElement('div');
  spanName.innerHTML = html.toUpperCase()
  elementLi.setAttribute('id', element.id);
  elementLi.setAttribute('class', classLi);
  divpercent.setAttribute('class', 'li-conteiner');
  divpercent.innerHTML = 'Porcentaje Total :' + element.stats.percent;
  contenLis.setAttribute('class', 'conteiner');
  contenLis.appendChild(createDivconteiner('<b>Reads:', 'li-conteine', element.stats.reads));
  contenLis.appendChild(createDivconteiner('<b>Ejercicios:</b>', 'li-conteine', element.stats.exercises));
  contenLis.appendChild(createDivconteiner('<b>Quizzes:', 'li-conteine', element.stats.quizzes));
  contenedor.appendChild(spanName);
  contenedor.appendChild(divpercent);
  contenedor.appendChild(contenLis);
  elementLi.appendChild(contenedor);
  list.appendChild(elementLi);
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
// agregando evento de click para pintar los cohorts por sedes
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
// agrgando evento de click a los cohorts para pintar a estudiantes
ulCohorts.addEventListener('click', (event) => {
  options.cohort.forEach(cohort => {
    if (cohort.id === event.target.id) {
      options.cohort = cohort;
    }
  });
  ServiceApiRequest(urlProgress, () => {
    listProgress.setProgres(getProgress());
    options.cohortData.progress = getProgress()
  });
  listOfStudent(event.target.id);
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
    ulStudents.innerHTML = '';
    listUser.setUsers(getUsers());
    let Lis = computeUsersStats(listUser.getNewUsers(), listProgress.getNewProgress(), listCohort.getCourses());
    let listFilter = filterUsers(Lis, value)
    listUser.setUsers(listFilter);
    listUser.getNewUsers().forEach(student => {
      if (student.role === 'student') {
        createListUser('list-students', 'elem-student', student, student.name);
      };
    });
  });
};
//  funcion de evento keyup para filtrar
search.addEventListener('keyup', (event) => {
  filter(event.target.value);
});
// funciones para ordenar asc y desc 
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
