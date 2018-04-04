var MyFirstController = function($scope, $http, userData, userGravatar, gitHubUserLookup) {

};

var MyJSONController = function ($scope, $http) {

    $http.get('query_1.json').success(function (data) {
        $scope.query = data;
        createDataTable(data);
    })

    function createDataTable(data) {
        var itemSourceStartPosition   = getItemSourceStartPosition(data);
        var flexGridTableNumberOfRows = getMaxRow(data);
        var flexGridTableNumberOfCols = getMaxCol(data);
        var topLeftColumnHeadersNumberOfRows = itemSourceStartPosition.row - 1;
        var topLeftColumnHeadersNumberOfCols = itemSourceStartPosition.col - 1;
        var columnHeadersNumberOfRows = itemSourceStartPosition.row - 1;
        var columnHeadersNumberOfCols = flexGridTableNumberOfCols - topLeftColumnHeadersNumberOfCols;
        var rowHeadersNumberOfRows = flexGridTableNumberOfRows - topLeftColumnHeadersNumberOfRows;
        var rowHeadersNumberOfCols = itemSourceStartPosition.col - 1;
        var itemSourceNumberOfRows = flexGridTableNumberOfRows - columnHeadersNumberOfRows;
        var itemSourceNumberOfCols = flexGridTableNumberOfCols - rowHeadersNumberOfCols;
        console.log("Size of top left column headers (row,col) : " + topLeftColumnHeadersNumberOfRows + "," + topLeftColumnHeadersNumberOfCols);
        console.log("Size of column headers (row,col) : " + columnHeadersNumberOfRows + "," + columnHeadersNumberOfCols);
        console.log("Size of row headers (row,col) : " + rowHeadersNumberOfRows + "," + rowHeadersNumberOfCols);
        console.log("Size of item source headers (row,col) : " + itemSourceNumberOfRows + "," + itemSourceNumberOfCols);

        //Initializing my dataTableArray
        var dataTableArray = new Array(flexGridTableNumberOfRows);
        for(var i = 0; i < flexGridTableNumberOfRows; i++){
            dataTableArray[i] = new Array(flexGridTableNumberOfCols);
            for(var j = 0; j < flexGridTableNumberOfCols; j++){
                dataTableArray[i][j] = 0;
            }
        }

        //Filling up my dataTableArray with data from JSON file
        data.Cells.forEach(function (element) {
            if(element.Value !== undefined){
                dataTableArray[parseInt(element.Row) - 1][parseInt(element.Col) - 1] = String(element.Value);
            }else{
                dataTableArray[parseInt(element.Row) - 1][parseInt(element.Col) - 1] = "";
            }
            if(parseInt(element.Cols) > 1 || parseInt(element.Rows) > 1){
                var cellRowStartPos = parseInt(element.Row) - 1;
                var cellColStartPos = parseInt(element.Col) - 1;
                var cellHeight = parseInt(element.Rows);
                var cellWidth = parseInt(element.Cols);
                for(var i = cellRowStartPos; i < cellRowStartPos + cellHeight; i++){
                    for(var j = cellColStartPos; j < cellColStartPos + cellWidth; j++){
                        if(element.Value !== undefined){
                            dataTableArray[i][j] = String(element.Value);
                        }else{
                            dataTableArray[i][j] = "";
                        }
                    }
                }
            }
        });
        console.log(dataTableArray);

        //filling Row Headers with data from dataTableArray
        var rowHeadersArray = new Array(rowHeadersNumberOfRows);
        for(var i = 0; i < rowHeadersNumberOfRows; i++){
            rowHeadersArray[i] = new Array(rowHeadersNumberOfCols);
            for(var j = 0; j < rowHeadersNumberOfCols; j++){
                rowHeadersArray[i][j] = dataTableArray[i + itemSourceStartPosition.row - 1][j];
            }
        }
        console.log(rowHeadersArray);

        //filling Column Headers with data from dataTableArray
        var columnHeadersArray = new Array(columnHeadersNumberOfRows);
        for(var i = 0; i < columnHeadersNumberOfRows; i++){
            columnHeadersArray[i] = new Array(columnHeadersNumberOfCols);
            for(var j = 0; j < columnHeadersNumberOfCols; j++){
                columnHeadersArray[i][j] = dataTableArray[i][j + itemSourceStartPosition.col - 1];
            }
        }
        console.log(columnHeadersArray);

        //filling Top Left Column Headers with data from dataTableArray
        var topLeftColumnHeadersArray = new Array(topLeftColumnHeadersNumberOfRows);
        for(var i = 0; i < topLeftColumnHeadersNumberOfRows; i++){
            topLeftColumnHeadersArray[i] = new Array(topLeftColumnHeadersNumberOfCols);
            for(var j = 0; j < topLeftColumnHeadersNumberOfCols; j++){
                topLeftColumnHeadersArray[i][j] = dataTableArray[i][j];
            }
        }
        console.log(topLeftColumnHeadersArray);

        //filling Item Source with data from dataTableArray
        var itemSourceArray = new Array(itemSourceNumberOfRows);
        for(var i = 0; i < itemSourceNumberOfRows; i++){
            itemSourceArray[i] = new Array(itemSourceNumberOfCols);
            for(var j = 0; j < itemSourceNumberOfCols; j++){
                itemSourceArray[i][j] = dataTableArray[i + itemSourceStartPosition.row - 1][j + itemSourceStartPosition.col - 1];
            }
        }
        console.log(itemSourceArray);

        //Initializing my FlexGrid table
        var grid = new wijmo.grid.FlexGrid('#myFlexGrid', {
            loadedRows: function(s, e) {
                s.autoSizeColumns();
                s.autoSizeRows();

            },
            cellEditEnded: function(s, e) {
                s.autoSizeColumns(e.col);
                s.autoSizeRows(e.row);
            },
            rowEditEnded: function(s, e){
                s.autoSizeColumns();
                s.autoSizeRow(e.row);
            }
        });

        //Creating Rows and Columns
        while (grid.columns.length < flexGridTableNumberOfCols - itemSourceStartPosition.col + 1) {
            grid.columns.push(new wijmo.grid.Column());
        }
        while (grid.rows.length < flexGridTableNumberOfRows - 1) {
            grid.rows.push(new wijmo.grid.Row());
        }

        //Adding additional columns in row headers
        if(itemSourceStartPosition.col - 1 > 1){
            for(var i = 0; i < itemSourceStartPosition.col - 2; i++){
                grid.rowHeaders.columns.push(new wijmo.grid.Column());
            }
        }

        //ADDING DATA FROM ARRAY TO FLEX GRID
        for(var i = 0; i < itemSourceStartPosition.row - 1; i++){
            for(var j = 0; j < flexGridTableNumberOfCols - itemSourceStartPosition.col + 1; j++){
                grid.columnHeaders.setCellData(0, j, columnHeadersArray[i][j]);
            }
        }

        for(var i = 0; i < flexGridTableNumberOfRows - itemSourceStartPosition.row + 1; i++){
            for(var j = 0; j < itemSourceStartPosition.col - 1; j++){
                grid.cells.grid.rowHeaders.setCellData(i, j, rowHeadersArray[i][j]);
            }
        }

        for(var i = 0; i < itemSourceStartPosition.row - 1; i++){
            for(var j = 0; j < itemSourceStartPosition.col - 1; j++){
                grid.topLeftCells.setCellData(i, j, topLeftColumnHeadersArray[i][j]);
            }
        }

        for(var i = 0; i < flexGridTableNumberOfRows - itemSourceStartPosition.row + 1; i++){
            for(var j = 0; j < flexGridTableNumberOfCols - itemSourceStartPosition.col + 1; j++){
                grid.cells.setCellData(i, j, itemSourceArray[i][j]);
            }
        }

        grid.rowHeaders.columns[0].wordWrap = true;
        grid.rowHeaders.columns[1].wordWrap = true;
        grid.topLeftCells.columns[0].width = "*";
        //grid.rowHeaders.columns[0].width = "*";
        //grid.rowHeaders.columns[1].width = "*";

        grid.columnHeaders.rows.defaultSize = 80;
        /*grid.autoSizeRows(0,grid.rows.length, true);
        grid.autoSizeColumns(0, grid.cols.length, true);*/

        grid.mergeManager = new wijmo.grid.CustomMergeManager(grid);
        //grid.columns[0].width="*";

        // use tooltip to show hit-test information
        var tt = new wijmo.Tooltip();
        var tip = '';
        grid.hostElement.addEventListener('mousemove', function(e) {
            var ht = grid.hitTest(e);
            if (ht.panel) {
                var newTip = wijmo.format('cellType: <b>{panel}</b><br/>row: <b>{row}</b><br/>column: <b>{col}</b><br>value: <b>{val}</b>', {
                    panel: wijmo.grid.CellType[ht.cellType],
                    row: ht.row,
                    col: ht.col,
                    val: ht.panel.getCellData(ht.row, ht.col, true)
                });
                if (newTip != tip) {
                    tip = newTip;
                    tt.show(ht.panel.hostElement.parentElement, tip, ht.panel.getCellBoundingRect(ht.row, ht.col));
                }
            } else {
                tt.hide();
                tip = '';
            }
        });
        theGrid.hostElement.addEventListener('mouseleave', function() {
            tt.hide();
            tip = '';
        })

        // show the effect of the headersVisibility property
        var headersVisibility = new wijmo.input.ComboBox('#headersVisibility', {
            itemsSource: 'None,Row,Column,All'.split(','),
            text: 'All',
            selectedIndexChanged: function(s, e) {
                grid.headersVisibility = s.text;
            }
        });

        // add a 'grid-panel' class to all grid panel hosts
        var panels = 'topLeftCells,columnHeaders,rowHeaders,cells,bottomLeftCells,columnFooters'.split(',');
        panels.forEach(function(p) {
            grid[p].hostElement.parentElement.classList.add('grid-panel');
        });

        function getItemSourceStartPosition(json_string){
            var startCoordinates = {
                row: 100,
                col: 100
            };

            json_string.Cells.forEach(function (element) {
                if(!element.IsHeader){
                    if(parseInt(element.Row) < startCoordinates.row){
                        if(parseInt(element.Col) < startCoordinates.col){
                            startCoordinates.row = element.Row;
                            startCoordinates.col = element.Col;
                        }
                    }
                }
            });
            return startCoordinates;
        }

        //Method to get max amount of Cols
        function getMaxCol(json_string){
            var maxCol = 0;
            json_string.Cells.forEach(function (element) {
                if(parseInt(element.Col) > maxCol) maxCol = parseInt(element.Col);
            });
            return maxCol;
        }

        //Method to get max amount of Rows
        function getMaxRow(json_string){
            var maxRow = 0;
            json_string.Cells.forEach(function (element) {
                if(parseInt(element.Row) > maxRow) maxRow = parseInt(element.Row);
            });
            return maxRow;
        }
    }

}

app.controller("MyFirstController", MyFirstController);
app.controller("MyJSONController", MyJSONController);
