(function(){
  'use strict';
  var golfApp = angular.module('handicaptracker', []);
 

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
        //var golferID = -1;
        //var mode = "";
        var reloadGolfers = false;
        
        return {
//            getGolferID: function() {
//                return golferID;
//            },
//            setGolferID: function(value) {
//                golferID = value;
//            },
//            getMode: function() {
//                return mode;
//            },
//            setMode: function(value) {
//                mode = value;
//            },
            getReloadGolfers: function() {
                return reloadGolfers;
            },
            setReloadGolfers: function(value) {
                reloadGolfers = value;
            }

        };
    });

      
golfApp.controller('MainController' ,function($scope, $ionicPopup, $ionicModal, golfersFactory, sharedProperties, $data, $http, parseFactory, $timeout, $ionicHistory, $ionicLoading) {
    
    $scope.showAbout = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'About',
                template: 'Version 1.01'
              });
              alertPopup.then(function(res) {
                //close
              });
         };
         
        
    $scope.$on('$locationChangeStart', function( event ) {
        //Check if the list of golfers should be reloaded
        if(sharedProperties.getReloadGolfers())
        {
            //reload the golfers
            golfersFactory.getGolfers().then(function(golfers) {
                $scope.Golfers = golfers;
              });
              
              $ionicHistory.clearHistory();
        }

        //set to false after each time the golfers page is viewed
        sharedProperties.setReloadGolfers(false);
    });

      //$scope.Golfers = $data.items;
    golfersFactory.getGolfers().then(function(golfers) {
      //golfersService.addGolfers(golfers);
      $scope.Golfers = golfers; //golfersService.getGolfers();
    });
            
            
   
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
            //return $http.get("http://www.golflink.com.au/handicap-history/?", {params:{"golflink_No": Golfer.GolfLinkNumber, "skip": "1"}}).then(function(response) {
                return $http.get("http://handicap.golflink.com.au/HandicapHistoryFull.aspx?", {params:{"golflink_no": Golfer.GolfLinkNumber, "skip": "1"}}).then(function(response) {
                    //return $http.get("http://ip.jsontest.com/").then(function(response) {
                    //success handler
                    //alert("Success");
                    var data = response.data;
                    var result = {
                        "Golfer": Golfer,
                        "PageSource": data
                    };                       
                       
                    return result;
                    
                }, function(response) {
                    //data, status
                    //alert(response.data);
                    //alert(response.status);
                    //alert(response.headers);
                    //alert(response.config);
                    
                    var data = response.data;
                    var result = {
                        "Golfer": Golfer,
                        "PageSource": data
                    };

                    return result;
                    
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
                    
                    $ionicLoading.show({ template: 'Handicap Information Updated', noBackdrop: true, duration: 1500 });
                    //reload the golfers
                    golfersFactory.getGolfers().then(function(golfers) {
                        $scope.Golfers = golfers;
                    });
                 }
              });
              
            }, 0 );
              
        };

        
        for(var i = 0; i < $scope.Golfers.length; i++) {
            //var id = $scope.Golfers[i].id;
            var Golfer = $scope.Golfers[i];
            
            getHandicapHistory(Golfer)
                    .then(parseHandicapHistory);                           
        }
        
        
    };
    
    
    $scope.DeletingGolfer = false;
    $scope.DeleteGolfer = function(golferID)
    {
        if($scope.DeletingGolfer === false)
        {
            $scope.DeletingGolfer = true;
            var confirmPopup = $ionicPopup.confirm({
              title: 'Delete Golfer',
              template: 'Are you sure you want to delete this golfer?'
            });
            confirmPopup.then(function(res) {
              if(res) {
               //delete gofler and reload
               DeleteGolfer(golferID);
               
               //reload the golfers
                golfersFactory.getGolfers().then(function(golfers) {
                    $scope.Golfers = golfers;
                });
              
                $ionicHistory.clearHistory();
               }

              $scope.DeletingGolfer = false;
            });         
              
        }

    };
         
  });

golfApp.controller('GolfersController', function($scope, $ionicPopup, sharedProperties) {
	
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

            //console.log(parseInt($("." + className).css("left")));
    };
    
});

golfApp.controller('GolferController', function($scope, golferFactory, sharedProperties, $ionicHistory, $stateParams) {
    
    $scope.myGoBack = function() {
        
        $ionicHistory.goBack();
    };
  
    $scope.Mode = "";
    $scope.$on('$ionicView.enter', function(){
        
        var golferID = $stateParams.golferID;
        $scope.Mode = golferID === "" ? "add" : "edit";
        
        //get the selected golfer details
        golferFactory.getGolfer(golferID).then(function(golfer){
            $scope.GolferDetails = golfer;
        });
    });

    
     //function to submit the form after all validation has occurred            
    $scope.submitGolferForm = function(theForm) {

        // check to make sure the form is valid before saving
        if(theForm.$valid) {
//        if ($scope.golferForm.$valid) {
            //check if adding a new golfer or simply saving an existing one
            if($scope.Mode === "add")
            {
                InsertGolfer($scope.GolferDetails);
            }
            else //updating
            {               
                UpdateGolfer($scope.GolferDetails);
            }
            
            sharedProperties.setReloadGolfers(true);
            
            //clear the form for the next time the window opens
            theForm.$setPristine();
            
            //this should close the golfer page and go back to the list of golfers
            $ionicHistory.goBack();
        }
        

    };

});

golfApp.controller('HandicapHistoryController', function($scope, handicapHistoryFactory, $ionicHistory, $stateParams) {
         
    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    };
    
    var golferID = $stateParams.golferID;
    
      handicapHistoryFactory.getHandicapHistory(golferID).then(function(history) {
        $scope.HandicapHistory = history;
      });
         
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
                    
                    result = {
                            GolferID : -1, 
                            GolferName : '', 
                            GolfLinkNumber : ''
                        };
                    for(var i = 0; i < res.rows.length; i++) {
                        
                        result.GolferID = res.rows.item(i)._id;
                        result.GolferName = res.rows.item(i).GolferName;
                        result.GolfLinkNumber = res.rows.item(i).GolfLinkNumber;
                        
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
            
            var TD = "<td";
	    var NEW_ROUND = "matescompresults";// class=\"alt";
            var HREF = "href";
	    //Find first trow. If not found then exit
	    var startPos = pageSource.indexOf(NEW_ROUND);
            var previousPos = -1;
            while (startPos > -1)
            {
                var handicapRow = "";
                var IncludedInHandicapCalculations = false;
                var endPos = 0;

                //Get the Date and Course
                //startPos = pageSource.indexOf("href", startPos);
                startPos = pageSource.indexOf(">", startPos) + 1;
                endPos = pageSource.indexOf("<", startPos);

                handicapRow = pageSource.substring(startPos, endPos);
                handicapRow = handicapRow.replace("Comp ", "");

                var info = "";
                //Now get the rest of the handicap information
                for (var x = 1; x <= 10; x++)
                {
                    startPos = pageSource.indexOf(TD, startPos) + 1;
                    startPos = pageSource.indexOf(TD, startPos) + TD.length;
                    
                    //Included In Handicap Calculations is parsed slightly different
                    if(x == 9)
                    {
                        endPos = pageSource.indexOf(">", startPos) + 1;
                        info = CleanInfo(pageSource.substring(startPos, endPos));
                        
                        var tempPos = info.indexOf("class=\"flag");
                        if (tempPos > -1)
                        {
                            IncludedInHandicapCalculations = true;
                        }
                    }
                      //Adjusted Gross requires different parsing
                    else if (x == 7 || x == 8)
                    {
                        startPos = pageSource.indexOf(HREF, startPos) + HREF.length;
                    }
                    
                    startPos = pageSource.indexOf(">", startPos) + 1;
                    endPos = pageSource.indexOf("<", startPos);
                    info = CleanInfo(pageSource.substring(startPos, endPos));

                    handicapRow = handicapRow + ", " + info;
                }
                
                
                startPos =  pageSource.indexOf(NEW_ROUND, startPos);
                
                if(startPos <= previousPos)
                {
                    startPos = -1;
                }
                else
                {
                    previousPos = startPos;
                }

                    
                handicapHistory.push(MapHandicapHistory(handicapRow + "," + IncludedInHandicapCalculations));
            } 
            
            //Old method
//            var SPAN_CLASS = "<span class";
//	    var NEW_ROUND = "trow";
//	    //Find first trow. If not found then exit
//	    var startPos = pageSource.indexOf(NEW_ROUND);
//            while (startPos > -1)
//            {
//                var handicapRow = "";
//                var IncludedInHandicapCalculations = false;
//                var endPos = 0;
//
//                //Get the Date and Course
//                startPos = pageSource.indexOf("href", startPos);
//                startPos = pageSource.indexOf(">", startPos) + 1;
//                endPos = pageSource.indexOf("<", startPos);
//
//                handicapRow = pageSource.substring(startPos, endPos);
//
//
//                var info = "";
//                //Now get the rest of the handicap information
//                for (var x = 1; x <= 9; x++)
//                {
//                    startPos = pageSource.indexOf(SPAN_CLASS, startPos) + 1;
//                    startPos = pageSource.indexOf(SPAN_CLASS, startPos) + SPAN_CLASS.length;
//                    startPos = pageSource.indexOf(">", startPos) + 1;
//                    endPos = pageSource.indexOf("</span", startPos);
//                    info = CleanInfo(pageSource.substring(startPos, endPos));
//
//                    //Played To has a 3rd span so need to check. The 3rd span is an indicator if the score is in the top 8 handicap calculations
//                    if (x === 8)
//                    {
//                        var tempPos = info.indexOf("span");
//                        if (tempPos > -1)
//                        {
//                            IncludedInHandicapCalculations = true;
//                            startPos = pageSource.indexOf(">", endPos) + 1;
//                            endPos = pageSource.indexOf("</span", startPos);
//                            info = CleanInfo(pageSource.substring(startPos, endPos));
//                        }
//                    }
//
//                    handicapRow = handicapRow + ", " + info;
//                }
//                
//                startPos =  pageSource.indexOf(NEW_ROUND, startPos);
//                handicapHistory.push(MapHandicapHistory(handicapRow + "," + IncludedInHandicapCalculations));
//            }    
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
            ClubAndComp: splitInfo[1] + " " + splitInfo[2], //club and comp
            Score: splitInfo[3],
            DSR: splitInfo[4],
            ScratchRating: splitInfo[5],
            SlopeRating: splitInfo[6],
            Par: splitInfo[7],
            DailyHandicap: splitInfo[8],
            Gross: splitInfo[9],
            PlayedTo: splitInfo[10],
            NewExact: splitInfo[12],
            IncludedInHandicapCalcs: splitInfo[13]
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


