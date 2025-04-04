import { Advocate } from '../types'
import { SpecialtyPill } from './specialtyPill'

interface Props {
  advocate: Advocate
}

export const AdvocateCard = ({ advocate }: Props) => (
  <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-white">
    <h2 className="text-lg font-bold mb-2">
      {advocate.firstName} {advocate.lastName}
    </h2>
    <p className="text-sm text-gray-600 mb-1">
      <strong>City:</strong> {advocate.city}
    </p>
    <p className="text-sm text-gray-600 mb-1">
      <strong>Degree:</strong> {advocate.degree}
    </p>
    <p className="text-sm text-gray-600 mb-1">
      <strong>Years of Experience:</strong> {advocate.yearsOfExperience}
    </p>
    <p className="text-sm text-gray-600 mb-1">
      <strong>Phone Number:</strong> {advocate.phoneNumber}
    </p>
    <div className="text-sm text-gray-600 mb-1 space-y-2">
      <strong>Specialties:</strong>
      <div className="flex flex-wrap gap-2">
        {advocate.specialties.map((specialty, i) => (
          <SpecialtyPill key={i} specialty={specialty} />
        ))}
      </div>
    </div>
  </div>
)
