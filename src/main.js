let btnLogging = document.getElementById('logging');
const firstTab = document.getElementById('first-tab');
const secondTab = document.getElementById('second-tab');
const optionSedes = document.getElementById('option1');
const optionPromocion = document.getElementById('option2');
const optionEstudiantes = document.getElementById('option3');
const menuSedes = document.getElementById('menu-sedes');
const ulCohorts = document.getElementById('lista-cohorts');
const ulStudents = document.getElementById('list-students')
const search = document.getElementById('my-search')
const thirdTab = document.getElementById("third-tab")
const sectionList = document.getElementById("side-list")
const progressDetail = document.getElementById("progress-detail")
const hideTabs = (tab1, tab2, tab3 = '', tab4 = '') => {
  tab1.classList.replace("show", "hide");
  tab2.classList.replace("hide", "show");
  if (tab3 != '') {
    tab3.classList.replace("hide", "show");
  } else if (tab4 != '') {
    tab4.classList.replace("show", "hide");
  };
};
btnLogging = (event) => {
  if (document.form.password.value === 'CONTRASEÑA' && document.form.user.value === 'USUARIO') {
  } else {
    event.preventDefault();
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
};
const listOfCohorts = (id) => {
  ServiceApiRequest(urlCohort, () => {
    hideTabs(firstTab, secondTab, sectionList)
    listCohort.setCohort(getCohorts());
    listCohort.getNewCohort().forEach(cohort => {
      if (cohort.id.startsWith(id)) {
        createList("lista-cohorts", 'elem-cohort', cohort, cohort.id);
      };
    });
  });
};
menuSedes.addEventListener("click", (event) => {
  listOfCohorts(event.target.id);
});
const listOfStudent = (n) => {
  ServiceApiRequest(urlUser, () => {
    hideTabs(sectionList, thirdTab)
    listUser.setUsers(getUsers());
    listUser.getNewUsers().forEach(student => {
      if (student.signupCohort === n) {
        if (student.role == "student") {
          createList("list-students", 'elem-student', student, student.name)
        };
      };
    });
  });
};
ulCohorts.addEventListener("click", (event) => {
  listOfStudent(event.target.id);
  listOfProgress();
});
const filter = (value) => {
  ServiceApiRequest(urlUser, () => {
    listUser.setUsers(filterUsers(getUsers(), value))
    ulStudents.innerHTML = ''
    listUser.getNewUsers().forEach(student => {
      if (student.role == "student") {
        createList("list-students", 'elem-student', student, student.name)
      };
    });
  });
};
search.addEventListener("keyup", (event) => {
  filter(event.target.value);
});
const listOfProgress = () => {
  ServiceApiRequest(urlProgress, () => {
    listProgress.setProgres(getProgress());
    computeUsersStats(listUser.getNewUsers(), listProgress.getNewProgress(), listCohort.getCourses())
  });
};
ulStudents.addEventListener("click", (event) => {
  ServiceApiRequest(urlProgress, () => {
    listProgress.setProgres(getProgress());
    progressDetail.innerHTML = ''
    let Lis = computeUsersStats(listUser.getNewUsers(), listProgress.getNewProgress(), listCohort.getCourses())
    Lis = findUsers(Lis, event.target.id)
    const elementLi = document.createElement('span');
    elementLi.innerHTML = "Porcentaje Total : " + Lis.percent;
    progressDetail.appendChild(elementLi);
    const elementLi2 = document.createElement('span');
    elementLi2.innerHTML = "\n Ejercicios ";
    progressDetail.appendChild(elementLi2);
    const elementLi3 = document.createElement('li');
    elementLi3.innerHTML = "Total de Ejercicios: " + Lis.exercises.total;
    progressDetail.appendChild(elementLi3);
    const elementLi4 = document.createElement('li');
    elementLi4.innerHTML = "Ejercicios Completados: " + Lis.exercises.completed;
    progressDetail.appendChild(elementLi4);
    const elementLi5 = document.createElement('li');
    elementLi5.innerHTML = "Porcentaje de Ejercicios Completados" + Lis.exercises.percent;
    progressDetail.appendChild(elementLi5);
    const elementLi6 = document.createElement('span');
    elementLi6.innerHTML = "Reads: ";
    progressDetail.appendChild(elementLi6);
    const elementLi7 = document.createElement('li');
    elementLi7.innerHTML = "Total de Reads: " + Lis.reads.total;
    progressDetail.appendChild(elementLi7);
    const elementLi8 = document.createElement('li');
    elementLi8.innerHTML = "Reads Completadas: " + Lis.reads.completed;
    progressDetail.appendChild(elementLi8);
    const elementLi9 = document.createElement('li');
    elementLi9.innerHTML = "Porcentaje de Reads Completadas: " + Lis.reads.percent;
    progressDetail.appendChild(elementLi9);
    const elementLi10 = document.createElement('span');
    elementLi10.innerHTML = "Quizzes: ";
    progressDetail.appendChild(elementLi10);
    const elementLi11 = document.createElement('li');
    elementLi11.innerHTML = "Total de Quizzes: " + Lis.quizzes.total;
    progressDetail.appendChild(elementLi11);
    const elementLi12 = document.createElement('li');
    elementLi12.innerHTML = "Lecturas Quizzes: " + Lis.quizzes.completed;
    progressDetail.appendChild(elementLi12);
    const elementLi13 = document.createElement('li');
    elementLi13.innerHTML = "Porcentaje de Quizzes Completados: " + Lis.quizzes.percent;
    progressDetail.appendChild(elementLi13);
    const elementLi14 = document.createElement('li');
    elementLi14.innerHTML = "Puntaje Total de Quizzes Completados: " + Lis.quizzes.scoreSum;
    progressDetail.appendChild(elementLi14);
    const elementLi15 = document.createElement('li');
    elementLi15.innerHTML = "Promedio de Quizzes Completados: " + Lis.quizzes.scoreAvg;
    progressDetail.appendChild(elementLi15);
  });
});
document.getElementById('desc').addEventListener("click", (event) => {
  let orderBy = document.getElementById('orderBy').value;
  let user = computeUsersStats(listUser.getNewUsers(), listProgress.getNewProgress(), listCohort.getCourses())
  sortUsers(user, orderBy, 'desc');
  ulStudents.innerHTML = '';
  user.forEach(student => {
    if (student.role == "student") {
      createList("list-students", 'elem-student', student, student.name);
    };
  });
});
document.getElementById('asc').addEventListener("click", (event) => {
  let orderBy = document.getElementById('orderBy').value;
  let user = computeUsersStats(listUser.getNewUsers(), listProgress.getNewProgress(), listCohort.getCourses())
  sortUsers(user, orderBy, 'asc');
  ulStudents.innerHTML = '';
  user.forEach(student => {
    if (student.role == "student") {
      createList("list-students", 'elem-student', student, student.name);
    };
  });
});

