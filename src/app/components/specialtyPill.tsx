interface Props {
  specialty: string
}

export const SpecialtyPill = ({ specialty }: Props) => (
  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
    {specialty}
  </span>
)
