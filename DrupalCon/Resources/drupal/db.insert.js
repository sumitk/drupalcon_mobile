

Drupal.db.InsertQuery = function(table) {
  /**
   * The table on which to insert.
   *
   * @var string
   */
  this.table = table;
  
  /**
   * An array of fields on which to insert.
   *
   * @var array
   */
  this.insertFields = [];

  /**
   * An array of fields that should be set to their database-defined defaults.
   *
   * @var array
   */
  this.defaultFields = [];

  /**
   * A nested array of values to insert.
   *
   * $insertValues is an array of arrays. Each sub-array is either an
   * associative array whose keys are field names and whose values are field
   * values to insert, or a non-associative array of values in the same order
   * as $insertFields.
   *
   * Whether multiple insert sets will be run in a single query or multiple
   * queries is left to individual drivers to implement in whatever manner is
   * most appropriate. The order of values in each sub-array must match the
   * order of fields in $insertFields.
   *
   * @var array
   */
  this.insertValues = [];

  /**
   * A SelectQuery object to fetch the rows that should be inserted.
   *
   * @var SelectQueryInterface
   */
  this.fromQuery = null;
};

Drupal.db.InsertQuery.prototype.execute = function() {
  
};

/**
 * Adds a set of field->value pairs to be inserted.
 *
 * This method may only be called once. Calling it a second time will be
 * ignored. To queue up multiple sets of values to be inserted at once,
 * use the values() method.
 *
 * @param $fields
 *   An array of fields on which to insert. This array may be indexed or
 *   associative. If indexed, the array is taken to be the list of fields.
 *   If associative, the keys of the array are taken to be the fields and
 *   the values are taken to be corresponding values to insert. If a
 *   $values argument is provided, $fields must be indexed.
 * @param $values
 *   An array of fields to insert into the database. The values must be
 *   specified in the same order as the $fields array.
 *
 * @return InsertQuery
 *   The called object.
 */
Drupal.db.InsertQuery.prototype.fields = function(fields, values) {
  if (!this.insertFields) {
    if (!values) {
      if (!fields[0]) {
        var keys = [];
        var arrValues = [];
        for (var prop in fields) {
          if (fields.hasOwnProperty(prop)) {
            keys.push(prop);
            arrValues.push(fields[prop]);
          }
        }
        values = arrValues;
        fields = keys;
      }
    }
    
    this.insertFields = fields;
    if (values) {
      this.insertValues.push(values);
    }
  }

  return this;
};

Drupal.getObjectProperties = function(o) {
  var properties = [];
  var values = [];
  for (var prop in o) {
    if (o.hasOwnProperty(prop)) {
      properties.push(prop);
      values.push(o[prop]);
    }
  }
  
  return properties;
};

