// declarando variable DE BOTON
const btnLogging = document.getElementById('logging');
const laboratoriaBar = document.getElementById('laboratoriaBar');
const navigatingBar = document.getElementById('navigatingBar');
const loggingIn = document.getElementById('loggingIn');
const cohorts = document.getElementById("sede-lima");
const laboratoria2 = document.getElementById('laboratoria2');

// funcion para agregar evento a logging
btnLogging.addEventListener('click', function () {
 
  // condicional para ingresar con usuario y contraseña
  if (true || document.form.password.value == 'CONTRASEÑA' && document.form.user.value == 'USUARIO') {
    loggingIn.classList.replace('show', 'hide');
    navigatingBar.classList.replace('hide', 'show');
    laboratoriaBar.classList.replace('hide', 'show');
  } else {
    alert("Por favor ingrese el nombre de usuario y la contraseña correcta.");
  }
});

llenarlista=(ulId,classLi,element,html)=>{
  const list = document.getElementById(ulId);
  const liCohorts = document.createElement('li');
  liCohorts.setAttribute('id', element.id);
  liCohorts.setAttribute('class',classLi)
  liCohorts.innerHTML = html;
  list.appendChild(liCohorts);
}
// agregar evento a boton LIMA (aparece lista de cohorts/promociones)
cohorts.addEventListener('click', (event) => {
  event.preventDefault(); 
  // funcion para obtener lista de cohorts/promociones
  ServiceApiRequest(urlCohort,()=>{
    laboratoria2.classList.replace('hide', 'show');
    navigatingBar.classList.replace('show', 'hide');
    laboratoria2.classList.replace('hide', 'show');
    // for of que recorre array de json cohorts
    listCohort.setCohort(getCohortsUsers())
    for (const cohort of listCohort.getCohorts()) {  
      llenarlista("lista-cohorts",'elem-cohort',cohort,cohort.id)
      if(cohort.id === 'lim-2018-03-pre-core-pw'){
        addEventToCohortElem(document.getElementById(cohort.id),cohort.id,listCohort);
      }
    };
  });
});
// agregar evento a un cohort(lim-2018-03-pre-core-pw)
window.addEventToCohortElem = (elem,cohortId,listCohort) => {
  elem.addEventListener('click', (event) => {
    event.preventDefault();
    // funcion para recorrer json users(obtener nombres de estudiantes)
    ServiceApiRequest(urlUser,()=>{
      listUser.setUsers(getCohortsUsers());
      for (const student of listUser.getUsers()) {
        llenarlista("list-students","elem-student",student,student.name)
        addEventToUserElem(document.getElementById(student.id),cohortId,listCohort,listUser);
      }
    })
  })
};
// agrgar evento a los elementos de la lista de estudiantes
window.addEventToUserElem = (elem,cohortId,listCohort,listUse) => {
  elem.addEventListener('click', () => {
    event.preventDefault();
    // funcion para obtener porcentaje total de estudiantes
    ServiceApiRequest(urlProgress,()=>{
      const data = listProgress;
      listProgress.setProgres(getProgress());
      if (listProgress) {
        // console.log(data)
        computeUsersStats(listUser.getUsers(),listProgress.getProgress(),listCohort.getCourses(cohortId));
        const elemnnto = document.getElementsByClassName("elimina");
        filterUsers(listUser.getUsers())
        const list = document.getElementById("progress");
        const a = document.createElement('a');
        const percent = document.createElement('span');
        const lista = document.createElement('li');
        percent.setAttribute('class','elimina');       
        percent.innerHTML = "porcentaje total : "+ data.percent;
        lista.appendChild(percent);
        list.appendChild(lista); 
      }
    })
  })
};

const filterInput = document.getElementById("my-search")
const filterNames=()=>{
  const filterValue = filterInput.value.toUpperCase()
  let ulStudents = document.getElementById("list-students");
  let liStudent  = ulStudents.querySelectorAll("li.elem-student");
  for (item in listUser.users){
     i = 0
     if (i<liStudent.length){
       i++
     }
     let m = liStudent[i].getElementById(student.id);
     if (m.innerHTML.toUpperCase().indexOf(filterValue)>-1){
      liStudent[i].style.display = "";
     } else{
      liStudent[i].style.display = "none";
     }
    
     }
}

filterInput.addEventListener("keyup",filterNames(listUser.getUsers(),filterNames()))
