/**
 * @function createDataset
 * @description creates the dataset that will handle select queries
 * @param {string[]} fields fields to be returned
 * @param {object[]} constraints dataset constraints
 * @param {string[]} sortFields sorting fields
 * @returns {DatasetDTO} Fluig Dataset
 * @since 2022/06/23
 */
function createDataset(fields, constraints, sortFields) {
  var dataset = DatasetBuilder.newDataset();
  log.info('@@ fluig_execute_select_query -> Query runner dataset started');
  var connection = null;
  var statement = null;
  var dbResult = null;
  var columnCount = null;
  var query = null;
  var dataSource = 'java:/jdbc/AppDS';
  var rowsCount = 0;

  try {
    if (constraints !== null) {
      for (var i in constraints) {
        var fieldName = constraints[i].getFieldName().trim()
        var initialValue = constraints[i].getInitialValue().trim();

        if ('query'.equals(fieldName)) {
          query = java.lang.String.valueOf(initialValue);
          log.info('@@ fluig_execute_select_query -> Raw query sent: ' + query);
        }
        if ('uriQuery'.equals(fieldName)) {
          query = java.lang.String.valueOf(decodeURI(initialValue));
          log.info('@@ fluig_execute_select_query -> Raw URI query sent: ' + initialValue);
          log.info('@@ fluig_execute_select_query -> Decoded URI query: ' + query);
        }
      }
    }

    if (query !== null && !''.equals(query)) {
      log.info('@@ fluig_execute_select_query -> Getting database connection');
      connection = new javax.naming.InitialContext()
        .lookup(dataSource)
        .getConnection();
      log.info('@@ fluig_execute_select_query -> Preparing query statement');
      statement = connection.prepareStatement(query);
      log.info('@@ fluig_execute_select_query -> Executing query');
      dbResult = statement.executeQuery();
      columnCount = dbResult.getMetaData().getColumnCount();

      for (var i = 1; i <= columnCount; i++) {
        dataset.addColumn(dbResult.getMetaData().getColumnName(i));
      }

      while (dbResult.next()) {
        var rows = [];
        for (var i = 1; i <= columnCount; i++) {
          var value = dbResult.getObject(
            dbResult.getMetaData().getColumnName(i)
          );
          rows.push(value !== null ? value.toString().trim() : '');
        }
        dataset.addRow(rows);
        rowsCount++;
      }

      log.info(
        '@@ fluig_execute_select_query -> Query executed and returned ' +
          columnCount +
          ' columns and ' +
          rowsCount +
          ' rows.'
      );
    } else {
      throw 'No query was sent for execution';
    }
  } catch (e) {
    dataset.addColumn('ERROR');
    dataset.addRow([e.message || e]);
    log.error(
      '@@ fluig_execute_select_query -> Error executing the dataset: ' + e
    );
  } finally {
    if (dbResult !== null) {
      log.info('@@ fluig_execute_select_query -> Closing database result');
      dbResult.close();
    }
    if (statement !== null) {
      log.info('@@ fluig_execute_select_query -> Closing database statement');
      statement.close();
    }
    if (connection !== null) {
      log.info('@@ fluig_execute_select_query -> Closing database connection');
      connection.close();
    }

    log.info('@@ fluig_execute_select_query -> Finishing dataset and returning data');
    return dataset;
  }
}
