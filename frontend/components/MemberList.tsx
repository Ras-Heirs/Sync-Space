export default function MemberList() {

  const members = [
    'Abram',
    'Kevin',
    'Felix',
    'Joshua'
  ]

  return (
    <div className="glass rounded-3xl p-6">

      <h2 className="text-2xl font-bold mb-5">
        Members
      </h2>

      <div className="space-y-4">

        {members.map((member, index) => (

          <div
            key={index}
            className="flex items-center gap-3 bg-white/5 p-3 rounded-xl"
          >

            <div className="w-10 h-10 rounded-full bg-cyan-500" />

            <p>{member}</p>

          </div>

        ))}

      </div>

    </div>
  )
}