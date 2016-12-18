 
/*
 *RUN THIS FUNCTION TO SETUP SNOOZE LABELS
 */
function setup() {
    // Create the labels we’ll need for snoozing
    var MAX_DAYS= 31 ; // you can modify
    GmailApp.createLabel("Zzz");
    for (var i = 0; i <= MAX_DAYS; ++i) {
        GmailApp.createLabel(getLabelNameDays(i));
    }
  }



/*
* SCHEDULE THIS FUNCTION TO BE INVOKED EVERYDAY MORNING 
*/
function moveSnoozes() {

     var unSnoozedLabel = GmailApp.getUserLabelByName(getLabelNameDays(0));
   
     var unSnoozedmails = unSnoozedLabel.getThreads();
     if(unSnoozedmails) {
       GmailApp.markThreadsUnread(unSnoozedmails); 
     }
     
   // have to get the label by name first
   var d=new Date(); 
   var todayLabelString = (d.getMonth()+1) +"-"+ d.getDate();
   var todayLabel = GmailApp.getUserLabelByName(todayLabelString);
   if(todayLabel){
     var todaymails = todayLabel.getThreads();
     if(todaymails) {
       GmailApp.markThreadsUnread(todaymails); 
       unSnoozedLabel.addToThreads(todaymails);
     }
     GmailApp.deleteLabel(todayLabel);
  }
  
  // Snooze
    var oldLabel, newLabel, page;
    for (var i = 1; i <= 31; ++i) {
        newLabel = oldLabel;
        oldLabel = GmailApp.getUserLabelByName(getLabelNameDays(i));
        page = null;

// Get threads in "pages" of 100 at a time 
        while(!page || page.length == 100) {
            page = oldLabel.getThreads(0, 100);
            if (page.length > 0) {
                if (newLabel) {
// Move the threads into "today's" label 
                    newLabel.addToThreads(page);
                }
                else {
                   //  it's time to unsnooze it 
                    GmailApp.moveThreadsToInbox(page);
                    GmailApp.markThreadsUnread(page);
                    unSnoozedLabel.addToThreads(page);
                    
                }
// Move the threads out of "yesterday's" label 
                oldLabel.removeFromThreads(page);
            }
        }
    }
}


function getLabelNameDays(i) {
    return "Zzz/" + i + " d";
}
