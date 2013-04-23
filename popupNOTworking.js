// *****   AJAX STUFF   *************************************************************** 

/* standard Ajax xhr function */

function getHTTPObject() {

    var xhr = new XMLHttpRequest();
    
    // spit out the correct one so we can use it
    return xhr;
}

/* define the Ajax call */

function ajaxCall(dataUrl, callback) {
    
    /* use our function to get the correct Ajax object based on support */
    var request = getHTTPObject();
    //outputElement.innerHTML = "Please enter a valid number";
      
    request.onreadystatechange = function () {
        
        // check to see if the Ajax call went through
        if (request.readyState === 4 && request.status === 200) {
            
            // save the ajax response to a variable
            var allErrorsJSONObject = JSON.parse(request.responseText);
            
            // make sure the callback is indeed a function before executing it
            if (typeof callback === "function") {
            
                callback(allErrorsJSONObject);
            
            } // end check
    
        } // end ajax status check
    
    }; // end onreadystatechange
    
    request.open("GET", dataUrl, true);
    request.send(null);

}

// *****  /AJAX STUFF   *************************************************************** 


// begin IIFE (immediately invoked function expression)
// http://benalman.com/news/2010/11/immediately-invoked-function-expression/
(function () {
	
	var button = document.getElementById("convert"),
	    hexVal = document.getElementById("hex"),
        decVal = document.getElementById("result"),
		target = document.getElementById("errordesc"),
        anpErrorNumber = document.getElementById("anpErrNum"),
        taskServerErrorNumber = document.getElementById("taskServerErrNum"),
        winsockErrorNumber = document.getElementById("winsockErrNum"),
        phase = document.getElementById("phase");
    
        $( "#tabs" ).tabs({ heightStyle: "auto" });
        $(".phase").hide();
  

	var winError = {

    //conversion method.
            conversion: function () {
      
                // parseInt function converts to hex when second argument = 16
                var dec = parseInt(hexVal.value, 16);
                decVal.value = dec;
           
            },

		    // search method
		    search: function (event) {

			    var output = document.getElementById("errordesc");

			    ajaxCall('data/errorcodes.json', function (data) {

                    var winErrorCodes = data.winErrCodes,	// "data" is the contents of the JSON file, "errorCodes" is the Win32 error object inside. 
                        count = winErrorCodes.length,
                        i,
                        searchValue = decVal.value;
                    if (count > 0 && searchValue !== "") {
          
                        for (i = 0; i < count; i++) {
                            var obj = winErrorCodes[i];
            
                            if (obj.code === searchValue) {
                                output.innerHTML = obj.desc;
                                break;
                            }
           
                        } // end for loop
                        
                    } // end if count check

			    }); // end AJAX call
                
		    } // end search method
        
	    }; // end winError object
    
    var genericError = {
        
 
        search: function (event) {
        
            var $tabs = $('#tabs').tabs(),
                selected = $tabs.tabs('option', 'selected'),
                output,
                errorCodes,
                searchValue;


            ajaxCall('data/errorcodes.json', function (data) {


                // logic to determine which JSON object/search value to pull from, which output to use
                if (selected === 0) {
                    console.log("Windows");
                    errorCodes = data.winErrCodes;
                } else if (selected === 1) {
                    console.log("ANP");
                    errorCodes = data.anpCodes; //maps
                    searchValue = anpErrorNumber.value;
                    output = document.getElementById("errordescANP");
                    console.log("search value: " + searchValue);
                    if (parseInt(anpErrorNumber.value) === 3) {
                        $(".phase").show();
                        errorCodes = data.event3phase;
                        searchValue = phase.value;
                        console.log(" phase search value: " + searchValue);
                    } else {
                        $(".phase").hide();
                    }
                
                } else if (selected === 2) {
                    console.log("Task Server");
                    errorCodes = data.taskServerCodes;
                    searchValue = taskServerErrorNumber.value;
                    output = document.getElementById("errorDescTaskServer");
                } else if (selected === 3) {
                    console.log("WinSock");
                     errorCodes = data.winsockCodes;
                     searchValue = winsockErrorNumber.value;
                     output = document.getElementById("winsockErrDesc");*/
                    // genericError.lookUp(data.winsockCodes,winsockErrorNumber,winsockErrDesc);
                } else {
                    alert("Sorry, don't recognize that selected tab");
                }
                
                var count = errorCodes.length,
                    i;

                for (i = 0; i < count; i++) {
                    var obj = errorCodes[i];

                    if (obj.code === searchValue) {
                        output.innerHTML = obj.desc;
                        break;
                    } else {
                        output.innerHTML = "Please enter a valid error code.";
                    }
                }

            }); // end AJAX call
    
        }; //end search

        // lookUp : function(errCodes, sv, output) {
        //     var count = errCodes.length,
        //         i,
        //         sv = sv.value;

        //     for (i = 0; i < count; i++) {
        //             var obj = errCodes[i];

        //             if (obj.code === sv) {
        //                 output.innerHTML = obj.desc;
        //                 break;
        //             } else {
        //                 output.innerHTML = "Please enter a valid error code.";
        //             }
        //         } //end for
        // };
    
        
    }; // end genricError


	hexVal.addEventListener("keyup", winError.conversion, false);
    hexVal.addEventListener("keyup", winError.search, false);

    anpErrorNumber.addEventListener("keyup", genericError.search, false);
    phase.addEventListener("keyUp", genericError.search, false);
    taskServerErrorNumber.addEventListener("keyup", genericError.search, false);
    winsockErrorNumber.addEventListener("keyup", genericError.search, false);
  
})(); //end anonymous function



