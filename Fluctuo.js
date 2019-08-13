(function() {

  /***************************************************************************************************/
  /**************************** PREPARATION CODE *****************************************************/
  /***************************************************************************************************/

  // Browse companies listed as parameter by UUID & Name and get all investments & acquisitions
  function getProviders(p_table) {

    $.ajax({
      url: "https://api.multicycles.org/v1?access_token=25jBlbee9movEcBXSR7n2HQHkJLdHsmj",
      type: "POST",
      //contentType: "text/plain", // application/json
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json"
      },
      data: JSON.stringify(
        {query:"query ($lat: Float!, $lng: Float!) {\n  providers(lat: $lat, lng: $lng) {\n    name\n    slug\n  }\n}\n",variables:{"lat":59.8939225,"lng":10.7150777}}
      ),
      dataType: "json",
      success: function(response) {
        var providersJSON = response.data.providers;
        var providersTableData = [];
        for (var i = 0, len = providersJSON.length; i < len; i++) {
          providersTableData.push({
            "name": providersJSON[i].name,
            "slug": providersJSON[i].slug
          });
        }

        /*var providersTableData = [];
        providersTableData.push({
          "name": "successTOTO",
          "slug": "successTITI"
        });*/


        p_table.appendRows(providersTableData);
        /*for (var i = 0, len = providersTableData.length; i < len; i++) {
          console.log(providersTableData[i]);
        }*/
        //console.log(response.data.providers);
      },
      error: function(response2) {
        console.log("la function ERROR est appellee");
      }
    });
  }

  /***************************************************************************************************/
  /******************************** RUNNING CODE *****************************************************/
  /***************************************************************************************************/

  var myConnector = tableau.makeConnector();

  // When you create multiple table schemas, the WDC API calls the getData function once for each schema.
  myConnector.getSchema = function(schemaCallback) {

    // Providers
    var Providers_cols = [{
      id: "name",
      alias: "Name",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "slug",
      alias: "Slug",
      dataType: tableau.dataTypeEnum.string
    }];
    var Providers_Schema = {
      id: "Providers", // table.tableInfo.id
      alias: "Providers",
      columns: Providers_cols
    };

    // It's only when several schemas are passed to this function that the getData function is called several times
    schemaCallback([Providers_Schema]);
  };

  // When you create multiple table schemas, the WDC API calls the getData function once for each schema.
  // As a result, you need a way to change the call to the API for each table. The easiest way to do this is to use the table.tableInfo.id value that we set in the table schemas.
  myConnector.getData = function(table, doneCallback) {

    getProviders(table);
    doneCallback();

  };

  tableau.registerConnector(myConnector);

  $(document).ready(function() {
    $("#submitButton").click(function() {
      tableau.connectionName = "Fluctuo Feed";
      tableau.submit();
      //getProviders();
    });
  });
})();
