import { useState, type FC } from "react"

interface ProfileData {
  name: string
  title: string
  company: string
  location: string
  isPurdueGrad: boolean
  graduationYear: string
  linkedinUrl: string
  connectionDegree: string
  profileImageUrl: string
}

interface ProfileModalProps {
  data: ProfileData
  onClose: () => void
  onSave: (data: ProfileData & { rating: number; tags: string[]; comments: string }) => void
}

const ProfileModal: FC<ProfileModalProps> = ({ data, onClose, onSave }) => {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [tags, setTags] = useState<string[]>(["Potential Employer"])
  const [tagInput, setTagInput] = useState("")
  const [comments, setComments] = useState("")
  
  // Editable fields
  const [name, setName] = useState(data.name)
  const [title, setTitle] = useState(data.title)
  const [company, setCompany] = useState(data.company)
  const [location, setLocation] = useState(data.location)
  const [isPurdueGrad, setIsPurdueGrad] = useState(data.isPurdueGrad)
  const [graduationYear, setGraduationYear] = useState(data.graduationYear)
  const [connectionDegree, setConnectionDegree] = useState(data.connectionDegree)

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSave = () => {
    onSave({
      name,
      title,
      company,
      location,
      isPurdueGrad,
      graduationYear,
      linkedinUrl: data.linkedinUrl,
      connectionDegree,
      profileImageUrl: data.profileImageUrl,
      rating,
      tags,
      comments
    })
    onClose()
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center z-[10000] pt-20"
      onClick={onClose}
    >
      <div 
        className="bg-purdue-gold-light rounded-xl shadow-2xl w-[380px] max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Header */}
        <div className="bg-purdue-black text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
          <h2 className="text-xl font-display font-semibold tracking-wide">
            Purdue Link
          </h2>
          <button 
            onClick={onClose}
            className="text-purdue-gold hover:text-white transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Contact Details Section */}
        <div className="px-6 py-5 space-y-4">
          <h3 className="text-purdue-black font-semibold text-sm mb-3">
            Contact Details
          </h3>

          {/* Name */}
          <div>
            <label className="block text-purdue-black text-xs font-medium mb-1">
              Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:border-purdue-gold focus:ring-2 focus:ring-purdue-gold focus:ring-opacity-30"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-purdue-black text-xs font-medium mb-1">
              Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:border-purdue-gold focus:ring-2 focus:ring-purdue-gold focus:ring-opacity-30"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-purdue-black text-xs font-medium mb-1">
              Company:
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:border-purdue-gold focus:ring-2 focus:ring-purdue-gold focus:ring-opacity-30"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-purdue-black text-xs font-medium mb-1">
              Location:
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:border-purdue-gold focus:ring-2 focus:ring-purdue-gold focus:ring-opacity-30"
            />
          </div>

          {/* Purdue Grad */}
          <div>
            <label className="block text-purdue-black text-xs font-medium mb-1">
              Purdue Grad?
            </label>
            <select
              value={isPurdueGrad ? "Yes" : "No"}
              onChange={(e) => setIsPurdueGrad(e.target.value === "Yes")}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:border-purdue-gold focus:ring-2 focus:ring-purdue-gold focus:ring-opacity-30"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Graduating Class */}
          <div>
            <label className="block text-purdue-black text-xs font-medium mb-1">
              Graduating Class:
            </label>
            <input
              type="text"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              placeholder="e.g., 2020"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:border-purdue-gold focus:ring-2 focus:ring-purdue-gold focus:ring-opacity-30"
            />
          </div>

          {/* LinkedIn URL */}
          <div>
            <label className="block text-purdue-black text-xs font-medium mb-1">
              LinkedIn URL:
            </label>
            <input
              type="text"
              value={data.linkedinUrl}
              readOnly
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-600 truncate"
              title={data.linkedinUrl}
            />
          </div>

          {/* Connection Degree */}
          <div>
            <label className="block text-purdue-black text-xs font-medium mb-1">
              Connection Degree:
            </label>
            <input
              type="text"
              value={connectionDegree}
              onChange={(e) => setConnectionDegree(e.target.value)}
              placeholder="e.g., 2nd Level"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:border-purdue-gold focus:ring-2 focus:ring-purdue-gold focus:ring-opacity-30"
            />
          </div>
        </div>

        {/* Notes Section */}
        <div className="px-6 pb-6 space-y-4">
          <h3 className="text-purdue-black font-semibold text-sm mb-3">
            Notes
          </h3>

          {/* Contact Score (Star Rating) */}
          <div>
            <label className="block text-purdue-black text-xs font-medium mb-2">
              Contact Score:
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill={star <= (hoveredRating || rating) ? "#CFB991" : "none"}
                    stroke={star <= (hoveredRating || rating) ? "#CFB991" : "#000000"}
                    strokeWidth="1.5"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-purdue-black text-xs font-medium mb-1">
              Tags:
            </label>
            
            {/* Display existing tags */}
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-purdue-gold text-purdue-black text-xs rounded"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-600 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Add new tag input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag (e.g., Mentor, Recruiter)..."
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:border-purdue-gold focus:ring-2 focus:ring-purdue-gold focus:ring-opacity-30"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-purdue-black text-purdue-gold rounded-lg text-sm font-medium
                           hover:bg-purdue-gold hover:text-purdue-black transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Additional Comments */}
          <div>
            <label className="block text-purdue-black text-xs font-medium mb-1">
              Additional Comments:
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              placeholder="Add notes about this contact..."
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:border-purdue-gold focus:ring-2 focus:ring-purdue-gold focus:ring-opacity-30
                         resize-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="px-6 pb-6">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-purdue-black text-white font-semibold rounded-lg
                       hover:bg-purdue-gold hover:text-purdue-black
                       transition-all duration-200 ease-in-out
                       border-2 border-purdue-black"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal


