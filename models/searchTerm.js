
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SearchTermSchema = new Schema(
  {
    searchVal: String,
    searchDate: Date
  },
  {
    timestamps: true
  }
);

const SearchTerm = mongoose.model('searchTerm', SearchTermSchema);

module.exports = SearchTerm;
