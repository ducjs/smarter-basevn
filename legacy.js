const main_smarterTaskTime = () => {
  // Hiện chỉ hỗ trợ dạng gantt > trường tuỳ chỉnh
  let taskTds = document.querySelectorAll("#board-table .task");
  for (let i = 0; i < taskTds.length; i++) {
    let dateDivs = taskTds[i].querySelectorAll(".task-time");
    let deadlineDiv = dateDivs[1];
    if (deadlineDiv && deadlineDiv.innerHTML !== "") {
      let deadlineDate = deadlineDiv.innerHTML;
      deadlineDate = deadlineDate.split("/");
      deadlineDate = `${deadlineDate[1]}/${deadlineDate[0]}/2022`;
      deadlineDate = new Date(deadlineDate);
      let deltaDays = (deadlineDate.getTime() - Date.now()) / (1000 * 3600 * 24);
      // const formatter = new Intl.RelativeTimeFormat();
      // let remainDaysText = formatter.format(Math.round(deltaDays), 'days');

      deltaDays = Math.round(deltaDays) + 1;
      let completedDiv = dateDivs[2];
      if (deltaDays >= 0 && deltaDays < 4) completedDiv.style = "color: red";
      switch (deltaDays) {
        case 0:
          completedDiv.innerHTML = `0d`;
          break;
        default: completedDiv.innerHTML = `${deltaDays}d`;
      }

    }


  }
}