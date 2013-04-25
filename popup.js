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
    
      
    request.onreadystatechange = function () {
        
        // check to see if the Ajax call went through
        if (request.readyState === 4 && request.status === 200) {
            
            // save the ajax response to a variable
            var data = JSON.parse(request.responseText);
            
            // make sure the callback is indeed a function before executing it
            if (typeof callback === "function") {
            
                callback(data);
            
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
        phaseNumber = document.getElementById("phaseField");
    
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
                selected = $tabs.tabs('option', 'selected');
                // output,
                // errorCodes,
                // searchValue;



            ajaxCall('data/errorcodes.json', function (data) {

                // http://training.bocoup.com/screencasts/dry-out-your-code-with-objects/
                var errorTypes = {
                    0 : {
                        errorCodes : data.winErrCodes
                    },
                    1 : {
                         errorCodes : data.anpCodes,
                        searchValue : anpErrorNumber.value,
                             output : document.getElementById("errordescANP")
                    },
                    2 : {
                        errorCodes : data.taskServerCodes,
                       searchValue : taskServerErrorNumber.value,
                            output : document.getElementById("errorDescTaskServer")
                    },
                    3 : {
                         errorCodes : data.winsockCodes,
                         searchValue : winsockErrorNumber.value,
                         output : document.getElementById("winsockErrDesc")

                    }
                };
                
                var errorType = errorTypes[ selected ];

                var count = errorType.errorCodes.length,
                    i;

               
                for (i = 0; i < count; i++) {
                    var obj = errorType.errorCodes[i];

                    if (obj.code === errorType.searchValue) {
                        errorType.output.innerHTML = obj.desc;
                       
                        if ((selected === 1) && (errorType.searchValue === "3" || errorType.searchValue === "5")) {
                        

                            $(".phase").show();
                            
                        } else {
                            $(".phase").innerHTML = "";
                            $(".phase").hide();
                        }

                        break;
                    
                    } else {
<<<<<<< HEAD
                        $(".phase").hide();
                        $("#phase").innerHTML = "";
                        errorType.output.innerHTML = "Please enter a valid error code."
=======
                    
                        errorType.output.innerHTML = "Please enter a valid error code.";
                    
>>>>>>> 57da068bbc6e0069870b865ce29642d57433d02e
                    }
                } // end for


            }); // end AJAX call
    
        }, //end search

        phaseSearch: function(event) {
            
            var output = document.getElementById("phaseInfo");



            ajaxCall('data/errorcodes.json', function (data) {

                var count,
                    i,
                    searchValue = document.getElementById("phaseField").value,
                    phaseData;

                if (anpErrorNumber.value === "3") {
                    phaseData = data.event3phase;
                } 

                if (anpErrorNumber.value === "5") {
                    phaseData = data.event5phase;

                }

                count = phaseData.length;

                for (i = 0; i < count; i++) {
                    var obj = phaseData[i];

                    var moreInfo = "";

                    if (obj.code === searchValue) {

                        if (searchValue > 100 && searchValue < 119) {
                            moreInfo = "Pull Transactions from other servers: ";
                        } else if (searchValue >= 200 && searchValue < 208) {
                            moreInfo = "ApplyTransactions from !IP file: ";
                        } else if (searchValue >=300 && searchValue < 307) {
                            moreInfo = "CompressLogFile: ";
                        }

                        output.innerHTML = moreInfo  + obj.desc;
                        break;
                    } else {
                        output.innerHTML = "Please enter a valid phase";
                    }
                }


            }); // end AJAX call
 
 } // end phaseSearch

    }; // end genricError

    

	hexVal.addEventListener("keyup", winError.conversion, false);
    hexVal.addEventListener("keyup", winError.search, false);

    anpErrorNumber.addEventListener("keyup", genericError.search, false);
    phaseNumber.addEventListener("keyup", genericError.phaseSearch, false);
    taskServerErrorNumber.addEventListener("keyup", genericError.search, false);
    winsockErrorNumber.addEventListener("keyup", genericError.search, false);
  
})(); //end anonymous function



