var db; //the database object

function OpenDatabase()
{
    db = window.openDatabase("HandicapTrackerDB", "1.0", "Handicap Tracker", 200000);
    db.transaction(populateDB, transaction_error, populateDB_success);
    
    //alert(db);
    return db;
}
function transaction_error(tx, error) {
	//$('#busy').hide();
    alert("Database Error: " + error.code);
    
    return;
}

function populateDB_success() {
    return;//db.transaction(getGolfers, transaction_error);
}

function populateDB(tx) {
	//$('#busy').show();
        //create golfers table
	var sql = 
		"CREATE TABLE IF NOT EXISTS golfers ( "+
		"_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
		"GolferName VARCHAR(50), " +
		"GolfLinkNumber VARCHAR(50), " +
		"Handicap VARCHAR(50) " +
		")";
    tx.executeSql(sql);
    
   
    //create handicap history table
    var sql = 
		"CREATE TABLE IF NOT EXISTS handicaphistory ( " +
		"_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
		"GolferID integer, " +
                "Date varchar(50), " +
                "ClubAndComp varchar(150), " +
                "Score varchar(5), " + 
                "DSR varchar(5), " + 
                "ScratchRating varchar(5), " +
                "SlopeRating varchar(5), " +
                "Par varchar(5), " +
                "DailyHandicap varchar(5), " + 
                "Gross varchar(5), " +
                "PlayedTo varchar(5), " + 
                "NewExact varchar(5), " + 
                "IncludedInHandicapCalcs varchar(50) " +
		")";
    tx.executeSql(sql);


//    tx.executeSql("DELETE FROM golfers");
//    tx.executeSql("INSERT INTO golfers (GolferName, GolfLinkNumber, Handicap) VALUES ('Steven Wells', '3011890722', '6.2')");
//    tx.executeSql("INSERT INTO golfers (GolferName, GolfLinkNumber, Handicap) VALUES ('John Smith', '3011890812', '17.8')");
    
    //tx.executeSql("DELETE FROM handicaphistory");
//    tx.executeSql("INSERT INTO handicaphistory (GolferID, Date, ClubAndComp, Score, DSR, ScratchRating, SlopeRating, Par, DailyHandicap, Gross, PlayedTo, NewExact, IncludedInHandicapCalcs) VALUES (87, '10/03/2015', 'Keysborough GC (Par)', '37', '74', '73', '131', '73', '8', '7.6', '3.5', '6.4', 'N');");	
//    tx.executeSql("INSERT INTO handicaphistory (GolferID, Date, ClubAndComp, Score, DSR, ScratchRating, SlopeRating, Par, DailyHandicap, Gross, PlayedTo, NewExact, IncludedInHandicapCalcs) VALUES (87, '10/03/2015', 'Keysborough GC (Stroke)', '37', '74', '73', '131', '73', '8', '7.6', '3.5', '6.4', 'Y');");	
//    tx.executeSql("INSERT INTO handicaphistory (GolferID, Date, ClubAndComp, Score, DSR, ScratchRating, SlopeRating, Par, DailyHandicap, Gross, PlayedTo, NewExact, IncludedInHandicapCalcs) VALUES (87, '10/03/2015', 'Keysborough GC (Stableford)', '37', '74', '73', '131', '73', '8', '7.6', '3.5', '6.4', 'N');");	
//    tx.executeSql("INSERT INTO handicaphistory (GolferID, Date, ClubAndComp, Score, DSR, ScratchRating, SlopeRating, Par, DailyHandicap, Gross, PlayedTo, NewExact, IncludedInHandicapCalcs) VALUES (87, '10/03/2015', 'Keysborough GC (Par)', '37', '74', '73', '131', '73', '8', '7.6', '3.5', '6.4', 'N');");	
//    tx.executeSql("INSERT INTO handicaphistory (GolferID, Date, ClubAndComp, Score, DSR, ScratchRating, SlopeRating, Par, DailyHandicap, Gross, PlayedTo, NewExact, IncludedInHandicapCalcs) VALUES (87, '10/03/2015', 'Keysborough GC (Stroke)', '37', '74', '73', '131', '73', '8', '7.6', '3.5', '6.4', 'Y');");	
//    tx.executeSql("INSERT INTO handicaphistory (GolferID, Date, ClubAndComp, Score, DSR, ScratchRating, SlopeRating, Par, DailyHandicap, Gross, PlayedTo, NewExact, IncludedInHandicapCalcs) VALUES (87, '10/03/2015', 'Keysborough GC (Stableford)', '37', '74', '73', '131', '73', '8', '7.6', '3.5', '6.4', 'N');");	
//    tx.executeSql("INSERT INTO handicaphistory (GolferID, Date, ClubAndComp, Score, DSR, ScratchRating, SlopeRating, Par, DailyHandicap, Gross, PlayedTo, NewExact, IncludedInHandicapCalcs) VALUES (87, '10/03/2015', 'Keysborough GC (Par)', '37', '74', '73', '131', '73', '8', '7.6', '3.5', '6.4', 'N');");	
//    tx.executeSql("INSERT INTO handicaphistory (GolferID, Date, ClubAndComp, Score, DSR, ScratchRating, SlopeRating, Par, DailyHandicap, Gross, PlayedTo, NewExact, IncludedInHandicapCalcs) VALUES (87, '10/03/2015', 'Keysborough GC (Stroke)', '37', '74', '73', '131', '73', '8', '7.6', '3.5', '6.4', 'Y');");	
//    tx.executeSql("INSERT INTO handicaphistory (GolferID, Date, ClubAndComp, Score, DSR, ScratchRating, SlopeRating, Par, DailyHandicap, Gross, PlayedTo, NewExact, IncludedInHandicapCalcs) VALUES (87, '10/03/2015', 'Keysborough GC (Stableford)', '37', '74', '73', '131', '73', '8', '7.6', '3.5', '6.4', 'N');");	
}

function getGolfers(tx) {
	var sql = "select * FROM GOLFERS ORDER BY _id";
	tx.executeSql(sql, [], getGolfers_success);
}

function getGolfers_success(tx, results) {
	//$('#busy').hide();
        
        //this needs to be a call back to the controller
    var json = [];    
    var len = results.rows.length;
    for (var i=0; i<len; i++) {
    	var golfer = results.rows.item(i);
	json.push({
            "ID"  : golfer._id,
            "GolferName": golfer.GolferName,
            "Handicap": golfer.Handicap
            });	
        //alert(golfer._id + ": " + golfer.GolferName + ": " + golfer.Handicap);
    }

    return json;
}

function InsertGolfer(golfer)
{
    
    db.transaction(function(tx){
        AddGolferToDB(tx,golfer);
    },
        tx_error,
        tx_success);

}

function tx_error(err)
{
    alert("error here: " + err.code);
}

function tx_success()
{
    //fires twice
}
function AddGolferToDB(tx, golfer)
{
    var sql = "INSERT INTO golfers (GolferName, GolfLinkNumber, Handicap) VALUES (?, ?, ?)";
    tx.executeSql(sql, [golfer.GolferName, golfer.GolfLinkNumber, "N/A"], tx_success);
}
function UpdateGolfer(golfer)
{   
    db.transaction(function(tx){
        UpdateGolferToDB(tx, golfer);
    },
        tx_error,
        tx_success);
    
}

function UpdateGolferToDB(tx, golfer)
{          
    var sql = "UPDATE golfers SET GolferName = ?, GolfLinkNumber = ? WHERE _id = ?";
    tx.executeSql(sql, [golfer.GolferName, golfer.GolfLinkNumber, golfer.GolferID], tx_success, tx_error);
}


function DeleteGolfer(golferID)
{   
    db.transaction(function(tx){
        DeleteGolferFromDB(tx, golferID);
    },
        tx_error,
        tx_success);
    
}

function DeleteGolferFromDB(tx, golferID)
{          
    var sql = "DELETE FROM golfers WHERE _id = ?";
    tx.executeSql(sql, [golferID], tx_success, tx_error);
}



function UpdateHandicapHistory(GolferID, HandicapHistory)
{
    db.transaction(function(tx){
        UpdateHandicapHistoryToDB(tx, GolferID, HandicapHistory);
    },
        tx_error,
        tx_success);
}

function UpdateHandicapHistoryToDB(tx, GolferID, HandicapHistory)
{          
    //get the current handicap
    var CurrentHandicap = "N/A";
    if(HandicapHistory.length > 0)
    {
        CurrentHandicap = HandicapHistory[0].NewExact;
    }
    
    var sql = "UPDATE golfers SET Handicap = ? WHERE _id = ?";
    tx.executeSql(sql, [CurrentHandicap, GolferID]);//, tx_success, tx_error);
    
    //delete previous handicap history before entering new ones
    tx.executeSql("DELETE FROM handicaphistory WHERE GolferID = " + GolferID);
    
    //insert each history item
    for(var i = 0; i < HandicapHistory.length; i++)
    {
            var hh  = HandicapHistory[i];

            tx.executeSql("INSERT INTO handicaphistory (GolferID, Date, ClubAndComp, Score, DSR, ScratchRating, SlopeRating, Par, DailyHandicap, Gross, PlayedTo, NewExact, " +
                            "IncludedInHandicapCalcs)" +
                            " VALUES (" + GolferID + ", '" + hh.Date + "', '" + hh.ClubAndComp + "', '" + hh.Score + "'," +
                                            " '" + hh.DSR + "', '" + hh.ScratchRating + "', '" + hh.SlopeRating + "', '" + hh.Par + "'," +
                                            " '" + hh.DailyHandicap + "', '" + hh.Gross + "', '" + hh.PlayedTo + "', '" + hh.NewExact + "', '" + hh.IncludedInHandicapCalcs + "');");	
    }
}