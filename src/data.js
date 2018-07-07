window.computeUsersStats = (users,progress,courses)=>{
    listProgress.setProgres(progress)
    const allUsers= users.map(usersWithStats => {
      usersWithStats.stats = {
        percent : listProgress.getIntroById(usersWithStats.id).percent,
        exercises : listProgress.getExersicesById(usersWithStats.id),
        reads: listProgress.getReadsById(usersWithStats.id),
        quizzes: listProgress.getQuizzesById(usersWithStats.id),
      };
      return usersWithStats
    });
    // sortName('name','desc')
    // console.log(allUsers)
   console.log(allUsers) 
    return allUsers;
  };
// window.sortUsers=(users,orderBy,orderDireccion)=>{
//   listUser.setUsers(users)
//   switch(orderBy){
//     case 'name':
//     listUser.sortName(orderBy,orderDireccion)
//     break
//     case 'percent':
//     listUser.sortStats(orderBy,orderDireccion)
//     break
//     case 'completed':
//     listUser.exercisesExercises(orderBy,orderDireccion)
//     break
//   }
//   // este ordena solo nombres
//   listUser.sortName('name','asc')
//   // este ordena stats
//  // listUser.sortStats('percent','asc')   
//   }
window.filterUsers=(users)=>{
  let filterBySearch = users.filter((user)=>{
    return user.name 
  })
  // console.log('hola')
  // return filterBySearch;
}
