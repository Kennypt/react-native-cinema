import mongoose, { Schema } from 'mongoose';


const SchemaFactory = (schemaDefinition, schemaOptions) => {
  return new mongoose.Schema({
      email: { type: String, required: true },
      is_verified: { type: Boolean, default: false },
      // spread/merge passed in schema definition
      ...schemaDefinition
    }, {
    timestamps: true,
    // spread/merge passed in schema options
    ...schemaOptions
  });
};
module.exports = SchemaFactory;
