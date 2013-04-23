// *****   AJAX STUFF   *************************************************************** 

/* standard Ajax xhr function */

function getHTTPObject() {

    var xhr;

    if (window.XMLHttpRequest) { // check for support
        
        // if it's supported, use it because it's better
        xhr = new XMLHttpRequest();
    
    } else if (window.ActiveXObject) { // check for the IE 6 Ajax
    
        // save it to the xhr variable
        xhr = new ActiveXObject("Msxml2.XMLHTTP");
    
    }
    
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
        winsockErrorNumber = document.getElementById("winsockErrNum");
    
        $( "#tabs" ).tabs({ heightStyle: "auto" });
    
  

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
        
        determineTab: function (event) {
            
        },
        
        search: function (event) {
        
            var $tabs = $('#tabs').tabs();
            var selected = $tabs.tabs('option', 'selected'); 
            var output;
            var errorCodes;
            var searchValue;


            ajaxCall('data/errorcodes.json', function (data) {

                
                console.log(selected + " " + typeof(selected));
                if (selected === 0) {
                    console.log("Windows");
                    errorCodes = data.winErrCodes;
                    
                } else if (selected === 1) {
                    console.log("ANP");
                    errorCodes = data.anpCodes; //maps
                    searchValue = anpErrorNumber.value;
                    output = document.getElementById("errordescANP");
                } else if (selected === 2) {
                    console.log("Task Server");
                    errorCodes = data.taskServerCodes;
                    searchValue = taskServerErrorNumber.value;
                    output = document.getElementById("errorDescTaskServer");
                } else if (selected === 3) {
                    console.log("WinSock");
                    errorCodes = data.winsockCodes;
                    searchValue = winsockErrorNumber.value;
                    output = document.getElementById("winsockErrDesc");
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
                        output.innerHTML = "enter a valid number..."
                    }
                }

            }); // end AJAX call
    
        } //end search
    
        
    }; // end genricError

    var anpError = {

            search: function (event) {

                var output = document.getElementById("errordescANP");

                ajaxCall('data/errorcodes.json', output, function (data) {

                    var anpErrorCodes = data.anpCodes,
                        count = anpErrorCodes.length,
                        i,
                        searchValue = anpErrorNumber.value;

                    for (i = 0; i < count; i++) {
                        var obj = anpErrorCodes[i];

                        if (obj.code === searchValue) {
                            output.innerHTML = obj.desc;
                            break;
                        }
                    }

                }); // end AJAX call
            }
        };

    var taskServerError = {
        
            search: function (event) {

                var output = document.getElementById("errorDescTaskServer");

                ajaxCall('data/errorcodes.json', output, function (data) {
        
                    var taskServerCodes = data.taskServerCodes,
                        count = taskServerCodes.length,
                        i,
                        searchValue = taskServerErrorNumber.value;
        
                    for (i = 0; i < count; i++) {
                        var obj = taskServerCodes[i];

                        if (obj.code === searchValue) {
                            output.innerHTML = obj.desc;
                            break;
                        }
                    }

                }); // end AJAX call
            }
        }; // /taskServerError  

    
    var winsockError = {
            search: function (event) {

                var output = document.getElementById("winsockErrDesc");

                ajaxCall('data/errorcodes.json', output, function (data) {

                    var winsockCodes = data.winsockCodes,
                        count = winsockCodes.length,
                        i,
                        searchValue = winsockErrorNumber.value;
                
                    for (i = 0; i < count; i++) {
                        var obj = winsockCodes[i];

                        if (obj.code === searchValue) {
                            output.innerHTML = obj.desc;
                            break;
                        }
                    }

                }); // end AJAX call
            }
        };
 
	hexVal.addEventListener("keyup", winError.conversion, false);
    hexVal.addEventListener("keyup", winError.search, false);

    anpErrorNumber.addEventListener("keyup", genericError.search, false);
    taskServerErrorNumber.addEventListener("keyup", genericError.search, false);
    winsockErrorNumber.addEventListener("keyup", genericError.search, false);
  
})(); //end anonymous function



