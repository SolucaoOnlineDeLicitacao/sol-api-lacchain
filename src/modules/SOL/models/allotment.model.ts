import { Document } from "mongoose";

import { AllotmentInterface } from "../interfaces/allotment.interface";

export interface AllotmentModel extends AllotmentInterface, Document{
}