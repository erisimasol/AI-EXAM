import mongoose from "mongoose";

// Atomic sequence counter used to generate gapless, collision-free serial
// numbers (e.g. certificate serials). Each named counter is incremented with
// a single atomic findOneAndUpdate({ $inc }) so concurrent issuance requests
// never receive the same value.
const counterSchema = mongoose.Schema({
  _id: { type: String, required: true }, // counter name, e.g. "certificate"
  seq: { type: Number, default: 0 },
});

counterSchema.statics.next = async function (name) {
  const doc = await this.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return doc.seq;
};

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;
