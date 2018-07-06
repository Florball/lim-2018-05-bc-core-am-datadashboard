// declarando variable DE BOTON
let btnLogging = document.getElementById('logging');
const laboratoria1 = document.getElementById('laboratoria-1');
const cohorts = document.getElementById('sede-lim');
const laboratoria2 = document.getElementById('laboratoria-2');
const optionSedes = document.getElementById('option1');
const optionPromocion = document.getElementById('option2');
const optionEstudiantes = document.getElementById('option3');
const optionGeneral = document.getElementById('option4');
// funcion para ingresar a login con usuario y contraseña
btnLogging = (event) => {
  if (document.form.password.value === 'CONTRASEÑA' && document.form.user.value === 'USUARIO') {
    continue;
  } else {
    event.preventDefault(); // Evita que accedan a la página sin contraseña
    alert("Por favor ingrese el nombre de usuario y la contraseña correcta.");
  };
};
llenarlista = (ulId, classLi, element, html) => {
  const list = document.getElementById(ulId);
  const liCohorts = document.createElement('li');
  liCohorts.setAttribute('id', element.id);
  liCohorts.setAttribute('class', classLi);
  liCohorts.innerHTML = html;
  list.appendChild(liCohorts);
};
// agregar evento a boton LIMA (aparece lista de cohorts/promociones)
cohorts.addEventListener('click', (event) => {
  event.preventDefault();
  // función para obtener lista de cohorts/promociones
  ServiceApiRequest(urlCohort, () => {
    laboratoria1.classList.replace('show', 'hide');
    laboratoria2.classList.replace('hide', 'show');
    // for of que recorre array de json cohorts
    listCohort.setCohort(getCohortsUsers())
    for (const cohort of listCohort.getCohorts()) {
      llenarlista('lista-cohorts', 'elem-cohort', cohort, cohort.id);
      if (cohort.id === 'lim-2018-03-pre-core-pw') {
        addEventToCohortElem(document.getElementById(cohort.id));
      };
    };
  });
});

// agregar evento a un cohort(lim-2018-03-pre-core-pw)
window.addEventToCohortElem = (elem) => {
  elem.addEventListener('click', (event) => {
    event.preventDefault();
    // funcion para recorrer json users(obtener nombres de estudiantes)
    ServiceApiRequest(urlUser, () => {
      listUser.setUsers(getCohortsUsers());
      for (const student of listUser.getUsers()) {
        llenarlista('list-students', '', student, student.name);
        addEventToUserElem(document.getElementById(student.id));
      };
    });
  });
};
// agregar evento a los elementos de la lista de estudiantes
window.addEventToUserElem = (elem) => {
  elem.addEventListener('click', () => {
    event.preventDefault();
    // funcion para obtener porcentaje total de estudiantes
    ServiceApiRequest(urlProgress, () => {
      const id = elem.getAttribute('id');
      const data = listProgress;
      listProgress.setProgres(getProgress());
      if (listProgress) {
        // console.log(data)
        computeUsersStats(listUser.getUsers(), listProgress.getProgress(), listCohort.getCourses());
        const elemnnto = document.getElementsByClassName('elimina');
        if (elemnnto) {
        };
        const list = document.getElementById('progress');
        const a = document.createElement('a');
        const percent = document.createElement('span');
        const lista = document.createElement('li');
        percent.setAttribute('class', 'elimina');
        percent.innerHTML = 'porcentaje total : ' + data.percent;
        lista.appendChild(percent);
        list.appendChild(lista);
      };
    });
  });
};