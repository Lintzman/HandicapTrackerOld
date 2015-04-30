(function(){
  'use strict';
  var golfApp = angular.module('handicaptracker', []);
 
golfApp.controller('oneCtrl', function($scope) {
	
    $scope.DragStopped = function(id) {
        var className = $(id.target).attr('class').split(' ')[0];
            //snap golfer with edit/delete options
            if(parseInt($("." + className).css("left")) < -30){
                    //alert("snap");
                    $("." + className).animate({left: '-150px'});
            }

            //snap just golfer
            if(parseInt($("." + className).css("left")) >= -30){
                    //alert("snap");
                    $("." + className).animate({left: '0px'});
            }

            console.log(parseInt($("." + className).css("left")));
    };
    
    $scope.EditGolfer = function()
    {
        alert("Edit Golfer");
    };
    
    $scope.DeleteGolfer = function()
    {
        alert("Delete Golfer");
    };
});

  golfApp.controller('AppController', function($scope) {
      
    $scope.title = "Handicap Tracker"  ;
     
  });


////This service holds all the golfers so all handicaps can be refreshed via the refresh menu button
//golfApp.service('golfersService', function() {
//  var golfersList;
//
//  var addGolfers = function(listGolfers) {
//      golfersList = listGolfers;
//  };
//
//  var getGolfers = function(){
//      return golfersList;
//  };
//
//  return {
//    addGolfers: addGolfers,
//    getGolfers: getGolfers
//  };
//
//});

    golfApp.service('sharedProperties', function() {
        var golferID = -1;
        var mode = "";
        var reloadGolfers = false;
        
        return {
            getGolferID: function() {
                return golferID;
            },
            setGolferID: function(value) {
                golferID = value;
            },
            getMode: function() {
                return mode;
            },
            setMode: function(value) {
                mode = value;
            },
            getReloadGolfers: function() {
                return reloadGolfers;
            },
            setReloadGolfers: function(value) {
                reloadGolfers = value;
            }

        };
    });

      
  golfApp.controller('MainController' ,function($scope, $ionicPopup, $ionicModal, golfersFactory, sharedProperties, $data, $http, parseFactory, $timeout) {
    
    $scope.showAbout = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'About',
                template: 'Version 1.01'
              });
              alertPopup.then(function(res) {
                //close
              });
         };
         
    //    ons.ready(function() {
//        navi.on('postpop', function(event) {
//
//            //Check if the list of golfers should be reloaded
//            if(sharedProperties.getReloadGolfers())
//            {
//                //reload the golfers
//                golfersFactory.getGolfers().then(function(golfers) {
//                    $scope.Golfers = golfers;
//                  });
//            }
//            
//            //set to false after each time the golfers page is viewed
//            sharedProperties.setReloadGolfers(false);
//        });
//      });

      //$scope.Golfers = $data.items;
    golfersFactory.getGolfers().then(function(golfers) {
      //golfersService.addGolfers(golfers);
      $scope.Golfers = golfers; //golfersService.getGolfers();
    });
            
            
//    $scope.showHandicapHistory = function(index) {
//     
//      var selectedItem = $scope.Golfers[index];
//      
//       golfersFactory.selectedItem = selectedItem;
//            //$scope.navi.pushPage('partials/handicapHistory.html');
//     };
   
   $ionicModal.fromTemplateUrl('templates/refresh-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      
      
      $scope.updateHandicaps = function(){
        
        var golferCounter = 0;
                
        //show getting handicap information
        $scope.modal.show();
        
        
        var getHandicapHistory = function(Golfer)
        {
            //http://handicap.golflink.com.au/HandicapHistoryFull.aspx?framed=1&skip=1&golflink_no=3011890722
                //return $http.get("http://handicap.golflink.com.au/HandicapHistoryFull.aspx?", {params:{"golflink_no": Golfer.GolfLinkNumber, "skip": "1"}}).then(function(response) {
                    return $http.get("http://www.golflink.com.au/handicap-history/?", {params:{"golflink_No": Golfer.GolfLinkNumber, "skip": "1"}}).then(function(response) {

                    var data = response.data;
                    var result = {
                        "Golfer": Golfer,
                        "PageSource": data
                    };
                    
//                    
                        //status = response.status,
                        //header = response.header,
                        //config = response.config;
                       
                       
                    return result;
                    // success handler
                }, function(response) {
                    var data = response.data;
                    var result = {
                        "Golfer": Golfer,
                        "PageSource": data
                    };
                        //status = response.status,
                        //header = response.header,
                        //config = response.config;
                    return result;
                    // error handler
                });
        },
        parseHandicapHistory = function(resultObj) 
        {
                 
  
            $timeout(function()
            {
                return parseFactory.parseHandicapHistory(resultObj.PageSource).then( function(handicapHistory) {
               
                var result = {
                    "Golfer": resultObj.Golfer,
                    "HandicapHistory": handicapHistory
                };
                    return result;
              }).then(function(resultObj) {
                  golferCounter++;
                  
                  //save the handicap history only if there are results
                 UpdateHandicapHistory(resultObj.Golfer.id, resultObj.HandicapHistory);
                 
                 if($scope.Golfers.length === golferCounter)
                 {
                    $scope.modal.hide();

                    //reload the golfers
                    golfersFactory.getGolfers().then(function(golfers) {
                        $scope.Golfers = golfers;
                    });
                 }
              });
              
            }, 0 );
              


//            return parseFactory.parseHandicapHistory(resultObj.PageSource).then(function(handicapHistory)
//                    {
//                        var result = {
//                            "Golfer": resultObj.Golfer,
//                            "HandicapHistory": handicapHistory
//                        };
//                        return result;
//                    });
        };
//        ,
//        saveHandicapHistory = function(resultObj)
//        {
//            
//            golferCounter++;
//            //save the handicap history only if there are results
//            UpdateHandicapHistory(resultObj.Golfer.id, resultObj.HandicapHistory);
//          
//            
//            if($scope.Golfers.length === golferCounter)
//            {
//                $scope.modal.hide();
//                
//                //reload the golfers
//                golfersFactory.getGolfers().then(function(golfers) {
//                    $scope.Golfers = golfers;
//                  });
//            }
//            
//        };
        
        
        for(var i = 0; i < $scope.Golfers.length; i++) {
            //var id = $scope.Golfers[i].id;
            var Golfer = $scope.Golfers[i];
            
            getHandicapHistory(Golfer)
                    .then(parseHandicapHistory);
                    //.then(saveHandicapHistory);
                           
        }
        
        //this closes the modal after 2 seconds
        //setTimeout('modalGetHandicaps.hide()', 2000);
        
    };
    
    
    $scope.showGolferDetails = function(mode)
    {
       sharedProperties.setMode(mode);
       sharedProperties.setGolferID(-1); 
    };

    $scope.showGolferDetails2 = function(mode, id)
    {
        sharedProperties.setMode(mode);
        sharedProperties.setGolferID(id); 
    };
         
  });

   
    
golfApp.controller('GolferController', function($scope, golferFactory, sharedProperties, $ionicHistory) {
    
   
    //get the selected golfer details
    golferFactory.getGolfer(sharedProperties.getGolferID()).then(function(golfer){
        $scope.GolferDetails = golfer;
    });
    
     //function to submit the form after all validation has occurred            
    $scope.submitGolferForm = function() {

        // check to make sure the form is valid before saving
        if ($scope.golferForm.$valid) {
            //check if adding a new golfer or simply saving an existing one
            if(sharedProperties.getMode() === "add")
            {
                InsertGolfer($scope.GolferDetails);
            }
            else //updating
            {               
                UpdateGolfer($scope.GolferDetails);
            }
            
            sharedProperties.setReloadGolfers(true);
            //this should close the golfer page and go back to the list of golfers
            $ionicHistory.viewHistory(); 
            $ionicHistory.goBack();
             ////$scope.navi.popPage();
        }
        

    };

});

golfApp.controller('HandicapHistoryController', function($scope, golfersFactory, handicapHistoryFactory) {
         
//      handicapHistoryFactory.getHandicapHistory(golfersFactory.selectedItem.id).then(function(history) {
//        $scope.HandicapHistory = history;
//      });
         
     $scope.getBackgroundClass = function(inCalcs){

         if( inCalcs.IncludedInHandicapCalcs === "true" ){
            return "in-handicap-calcs";
        } else{
            return "";
        }
    };
  });
  
  golfApp.factory('golfersFactory', function($q, $rootScope) {

    return {
        getGolfers: function() {
        
            var deferred, result = [];
            deferred = $q.defer();
            var db = OpenDatabase(); 

            
            db.transaction(function(tx)  {
                tx.executeSql("SELECT * FROM GOLFERS ORDER BY _id", [], function(tx, res) {
                    for(var i = 0; i < res.rows.length; i++) {
                        result.push({
                            id : res.rows.item(i)._id, 
                            GolferName : res.rows.item(i).GolferName, 
                            Handicap : res.rows.item(i).Handicap,
                            GolfLinkNumber: res.rows.item(i).GolfLinkNumber
                        });
                    }
                    
                    deferred.resolve(result);
                    $rootScope.$apply();
                },
                function(tx, err) {
                    alert(err);
                });
            });

            return deferred.promise;
        }
    };
    
  });
  
  golfApp.factory('handicapHistoryFactory', function($q, $rootScope) {

    return {
        getHandicapHistory: function(golferID) {
            
            var deferred, result = [];
            deferred = $q.defer();
            var db = window.openDatabase("HandicapTrackerDB", "1.0", "Handicap Tracker", 200000);

            db.transaction(function(tx)  {
                tx.executeSql("SELECT * FROM handicaphistory WHERE GolferID = ? ORDER BY _id", [golferID], function(tx, res) {
                    for(var i = 0; i < res.rows.length; i++) {
                        result.push({                
                            GolferID : res.rows.item(i).GolferID, 
                            Date : res.rows.item(i).Date, 
                            ClubAndComp : res.rows.item(i).ClubAndComp,
                            Score: res.rows.item(i).Score,
                            DSR : res.rows.item(i).DSR, 
                            ScratchRating : res.rows.item(i).ScratchRating, 
                            SlopeRating : res.rows.item(i).SlopeRating,
                            Par: res.rows.item(i).Par,
                            DailyHandicap : res.rows.item(i).DailyHandicap, 
                            Gross : res.rows.item(i).Gross, 
                            PlayedTo : res.rows.item(i).PlayedTo,
                            NewExact: res.rows.item(i).NewExact,
                            IncludedInHandicapCalcs: res.rows.item(i).IncludedInHandicapCalcs
                        });
                    }
                    deferred.resolve(result);
                    $rootScope.$apply();
                },
                function(tx, err) {
                    alert(err);
                });
            });

            return deferred.promise;
        }
    };
    
});
  
  
  golfApp.factory('golferFactory', function($q, $rootScope) {

    return {
        getGolfer: function(golferID) {
            
            var deferred, result;
            deferred = $q.defer();
            var db = window.openDatabase("HandicapTrackerDB", "1.0", "Handicap Tracker", 200000);

            db.transaction(function(tx)  {
                tx.executeSql("SELECT * FROM GOLFERS WHERE _id = ?", [golferID], function(tx, res) {
                    for(var i = 0; i < res.rows.length; i++) {
                        
                        result = {
                            GolferID : res.rows.item(i)._id, 
                            GolferName : res.rows.item(i).GolferName, 
                            GolfLinkNumber : res.rows.item(i).GolfLinkNumber
                        };
                    }
                    deferred.resolve(result);
                    $rootScope.$apply();
                },
                function(tx, err) {
                    alert(err);
                });
            });

            return deferred.promise;
        }
    };
    
});


  golfApp.factory('parseFactory', function($q, $rootScope) {

    
    
    return {
        parseHandicapHistory: function(pageSource) {
            var deferred;
            var handicapHistory = [];
            deferred = $q.defer();
            
            var SPAN_CLASS = "<span class";
	    var NEW_ROUND = "trow";
	    //Find first trow. If not found then exit
	    var startPos = pageSource.indexOf(NEW_ROUND);
            while (startPos > -1)
            {
                var handicapRow = "";
                var IncludedInHandicapCalculations = false;
                var endPos = 0;

                //Get the Date and Course
                startPos = pageSource.indexOf("href", startPos);
                startPos = pageSource.indexOf(">", startPos) + 1;
                endPos = pageSource.indexOf("<", startPos);

                handicapRow = pageSource.substring(startPos, endPos);


                var info = "";
                //Now get the rest of the handicap information
                for (var x = 1; x <= 9; x++)
                {
                    startPos = pageSource.indexOf(SPAN_CLASS, startPos) + 1;
                    startPos = pageSource.indexOf(SPAN_CLASS, startPos) + SPAN_CLASS.length;
                    startPos = pageSource.indexOf(">", startPos) + 1;
                    endPos = pageSource.indexOf("</span", startPos);
                    info = CleanInfo(pageSource.substring(startPos, endPos));

                    //Played To has a 3rd span so need to check. The 3rd span is an indicator if the score is in the top 8 handicap calculations
                    if (x === 8)
                    {
                        var tempPos = info.indexOf("span");
                        if (tempPos > -1)
                        {
                            IncludedInHandicapCalculations = true;
                            startPos = pageSource.indexOf(">", endPos) + 1;
                            endPos = pageSource.indexOf("</span", startPos);
                            info = CleanInfo(pageSource.substring(startPos, endPos));
                        }
                    }

                    handicapRow = handicapRow + ", " + info;
                }
                
                startPos =  pageSource.indexOf(NEW_ROUND, startPos);
                handicapHistory.push(MapHandicapHistory(handicapRow + "," + IncludedInHandicapCalculations));
            }    
            deferred.resolve(handicapHistory);
            $rootScope.$apply();
            
            return deferred.promise;
        }
        
    };
    
    function CleanInfo(info)
    {
        info = info.replace("\n", "");
        info = info.replace("\r", "");
        return info.trim();
    }
    
    
    function MapHandicapHistory(handicapRow)
    {
        //split handicap information
        var splitInfo = handicapRow.split(/\s*,\s*/);
        var handicapHistory = {

            //now map
            Date: splitInfo[0], //date
            ClubAndComp: splitInfo[1], //club and comp
            Score: splitInfo[2],
            DSR: splitInfo[3],
            ScratchRating: splitInfo[4],
            SlopeRating: splitInfo[5],
            Par: splitInfo[6],
            DailyHandicap: splitInfo[7],
            Gross: splitInfo[8],
            PlayedTo: splitInfo[9],
            NewExact: splitInfo[10],
            IncludedInHandicapCalcs: splitInfo[11]
        };
        return handicapHistory;
    }
	
});

golfApp.factory('$data', function() {
      var data = {};
      
      data.items = [
          { 
              GolferName: 'Mark',
              GolfLinkNumber: '3011890722',
              Handicap: '1.2',
              id: '1'
          },
          { 
              GolferName: 'Ryan',
              GolfLinkNumber: '3011890812',
              Handicap: '12.9',
              id: '2'
              
          }
          
      ]; 
      
      return data;
  });
})();


