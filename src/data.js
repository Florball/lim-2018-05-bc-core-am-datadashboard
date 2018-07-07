window.computeUsersStats = (users,progress,courses)=>{
  const allUsers= users.map(usersWithStats => {
    usersWithStats.stats = {
     percent: listProgress.getIntro(usersWithStats.id,courses).percent,
     exercises : getExersicesById(usersWithStats.id,courses),
     reads: getReadsById(usersWithStats.id,courses),
    quizzes: getQuizzesById(usersWithStats.id,courses),
    };
      return usersWithStats
    });   
    console.log(allUsers)
    return allUsers;
  };

// window.filterUsers=(users,search)=>{
//   users.filter((user)=>{
//     return user.name == search
//   })
//   console.log(users)
//   // return filterBySearch;
// }
