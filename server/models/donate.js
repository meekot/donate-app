import {Schema, model} from "mongoose";
import currencyList from "../../enums/currencyList";

const donateSchema = new Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be above zero']
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    validate: [(currency) => currencyList.some(c => c.code === currency), 'Unknown currency code']
  }
});

export default model('Donate', donateSchema);