let myDB = window.localStorage ;
let ticketsContainer = document.querySelector(".tickets-container");
let allFilterClasses = ["red" , "blue" , "green" , "yellow" , "black"] ;

function loadTickets()
{
    let allTickets = myDB.getItem("allTickets") ;
    if(allTickets)
    {
        allTickets = JSON.parse(allTickets) ;
        for(let i = 0 ; i < allTickets.length ; i++)
        {
            let ticketInfoObject = allTickets[i] ;
            appendTicket(ticketInfoObject); 
        }
    }
}

loadTickets() ;


function loadSelectedTickets(filter)
{
    let allTickets = myDB.getItem("allTickets") ;
    if(allTickets)
    {
        allTickets = JSON.parse(allTickets) ;
        for(let i = 0 ; i < allTickets.length ; i++)
        {
            let ticketInfoObject = allTickets[i] ;
            if(ticketInfoObject.ticketFilter == filter)
            {
                appendTicket(ticketInfoObject) ;
            }
        }
    }
}

function saveTicketToDB(ticketInfoObject)
{
    // let allTickets = [ticketInfoObject] ;
    let allTickets = myDB.getItem("allTickets") ;
    if(allTickets)
    {
        // already all tickets are present 
        allTickets = JSON.parse(allTickets) ;
        allTickets.push(ticketInfoObject) ;
        myDB.setItem("allTickets" , JSON.stringify(allTickets)) ;
    }
    else{
        // no all Tickets key found
        let allTickets = [ticketInfoObject] ;
        myDB.setItem("allTickets" , JSON.stringify(allTickets)) ;

    }
}


function appendTicket(ticketInfoObject)
{
    let {ticketFilter , ticketValue , ticketId} = ticketInfoObject ;
    let ticketDiv = document.createElement("div") ;
    ticketDiv.classList.add("ticket") ;
    ticketDiv.innerHTML = `<div class="ticket-header ${ticketFilter}"></div>
        <div class="ticket-content">
            <div class="ticket-info">
                <div class="ticket-id">${ticketId}</div>
                <div class="ticket-delete fas fa-trash"></div>
            </div>
            <div class="ticket-value">
                ${ticketValue} 
            </div>
        </div>` ;

    
    let ticketHeader = ticketDiv.querySelector(".ticket-header") ;
    // console.log(ticketHeader) ;

    ticketHeader.addEventListener("click" , function(e){
        // console.log(e) ;
        let currentFilter = e.target.classList[1] ;
        let indexOfCurrentFilter = allFilterClasses.indexOf(currentFilter) ;
        let newIndex = (indexOfCurrentFilter + 1) % allFilterClasses.length ;
        let newFilter = allFilterClasses[newIndex] ;

        ticketHeader.classList.remove(currentFilter);
        ticketHeader.classList.add(newFilter) ;

        let allTickets = JSON.parse(myDB.getItem("allTickets")) ;
        for(let i = 0 ; i < allTickets.length ; i++)
        {
            if(allTickets[i].ticketId == ticketId){
                allTickets[i].ticketFilter = newFilter ;
            }
        }
        myDB.setItem("allTickets" , JSON.stringify(allTickets)) ;
    })
    
    let deleteTicketBtn = ticketDiv.querySelector(".ticket-delete") ;

    // console.log(deleteTicketBtn) ;
    deleteTicketBtn.addEventListener("click" , function(e){
    // console.log(e) ;
    console.log(ticketId) ;
    ticketDiv.remove() ; // remove data form ui only

    deleteTicketFromDb(ticketId) ;

    })

    ticketsContainer.append(ticketDiv) ;

}

function deleteTicketFromDb(ticketId)
{
    let allTickets = JSON.parse(myDB.getItem("allTickets")) ;
    // [{} , {} , {} , {} , {} ]
    let updateTickets = allTickets.filter(function(ticketsObject){
        if(ticketsObject.ticketId == ticketId)
        {
            return false ;
        }
        return true ;
    })
    myDB.setItem("allTickets" , JSON.stringify(updateTickets)) ;
}