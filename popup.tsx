import { useEffect, useState } from "react"
import "~style.css"

interface Contact {
  id: string
  name: string
  title: string
  company: string
  location: string
  isPurdueGrad: boolean
  graduationYear: string
  linkedinUrl: string
  connectionDegree: string
  profileImageUrl: string
  rating: number
  tags: string[]
  comments: string
  dateAdded: string
}

function IndexPopup() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTag, setFilterTag] = useState("All")
  const [sortBy, setSortBy] = useState("dateAdded")
  const [allTags, setAllTags] = useState<string[]>([])

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    const { contacts = [] } = await chrome.storage.local.get('contacts')
    setContacts(contacts)
    
    // Extract all unique tags
    const tagsSet = new Set<string>()
    contacts.forEach((contact: Contact) => {
      contact.tags?.forEach((tag: string) => tagsSet.add(tag))
    })
    setAllTags(['All', ...Array.from(tagsSet).sort()])
  }

  const deleteContact = async (id: string) => {
    const updatedContacts = contacts.filter(c => c.id !== id)
    await chrome.storage.local.set({ contacts: updatedContacts })
    setContacts(updatedContacts)
  }

  const clearAllContacts = async () => {
    if (contacts.length === 0) {
      return
    }
    
    const confirmed = confirm(
      `Are you sure you want to delete ALL ${contacts.length} contact${contacts.length === 1 ? '' : 's'}? This action cannot be undone.`
    )
    
    if (confirmed) {
      await chrome.storage.local.set({ contacts: [] })
      setContacts([])
      setAllTags(['All'])
    }
  }

  const exportContacts = () => {
    // Create CSV headers
    const headers = [
      'Name',
      'Title',
      'Company',
      'Location',
      'Purdue Grad',
      'Graduation Year',
      'LinkedIn URL',
      'Connection Degree',
      'Profile Image URL',
      'Rating',
      'Tags',
      'Comments',
      'Date Added'
    ]
    
    // Helper function to escape CSV values
    const escapeCSV = (value: string | number | boolean) => {
      if (value === null || value === undefined) return ''
      const stringValue = String(value)
      // If value contains comma, quote, or newline, wrap in quotes and escape quotes
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }
    
    // Convert contacts to CSV rows
    const rows = contacts.map(contact => [
      escapeCSV(contact.name),
      escapeCSV(contact.title),
      escapeCSV(contact.company),
      escapeCSV(contact.location),
      escapeCSV(contact.isPurdueGrad ? 'Yes' : 'No'),
      escapeCSV(contact.graduationYear),
      escapeCSV(contact.linkedinUrl),
      escapeCSV(contact.connectionDegree),
      escapeCSV(contact.profileImageUrl || ''),
      escapeCSV(contact.rating),
      escapeCSV(contact.tags ? contact.tags.join('; ') : ''),
      escapeCSV(contact.comments),
      escapeCSV(new Date(contact.dateAdded).toLocaleString())
    ].join(','))
    
    // Combine headers and rows
    const csvContent = [headers.join(','), ...rows].join('\n')
    
    // Create and download CSV file
    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'purdue-link-contacts.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const filteredContacts = contacts
    .filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           c.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTag = filterTag === "All" || (c.tags && c.tags.includes(filterTag))
      return matchesSearch && matchesTag
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "name") return a.name.localeCompare(b.name)
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    })

  return (
    <div className="w-[600px] h-[600px] bg-purdue-gold-light">
      {/* Header */}
      <div className="bg-purdue-black text-white px-6 py-4">
        <h1 className="text-2xl font-display font-bold tracking-wide">Purdue Link</h1>
        <p className="text-sm text-purdue-gold mt-1">Your Professional Network Manager</p>
      </div>

      {/* Controls */}
      <div className="px-6 py-4 space-y-3 bg-white border-b border-gray-200">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm
                     focus:outline-none focus:border-purdue-gold focus:ring-2 focus:ring-purdue-gold focus:ring-opacity-30"
        />
        
        <div className="flex gap-3">
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:border-purdue-gold"
          >
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:border-purdue-gold"
          >
            <option value="dateAdded">Sort by Date</option>
            <option value="rating">Sort by Rating</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={exportContacts}
            className="flex-1 py-2 bg-purdue-gold text-purdue-black font-semibold rounded-lg
                       hover:bg-purdue-black hover:text-purdue-gold transition-colors
                       border-2 border-purdue-black text-sm"
          >
            Export (CSV)
          </button>
          
          <button
            onClick={clearAllContacts}
            disabled={contacts.length === 0}
            className="flex-1 py-2 bg-red-500 text-white font-semibold rounded-lg
                       hover:bg-red-600 transition-colors
                       border-2 border-red-600 text-sm
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Contact List */}
      <div className="overflow-y-auto" style={{ height: 'calc(600px - 200px)' }}>
        {filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="text-6xl mb-4">🎓</div>
            <h3 className="text-lg font-semibold text-purdue-black mb-2">No Contacts Yet</h3>
            <p className="text-sm text-gray-600">
              Visit LinkedIn profiles and click "Add to PurdueLink!" to start building your network.
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border border-gray-200"
              >
                <div className="flex gap-3 mb-2">
                  {/* Profile Image */}
                  {contact.profileImageUrl ? (
                    <img
                      src={contact.profileImageUrl}
                      alt={contact.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-purdue-gold flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-purdue-gold flex items-center justify-center flex-shrink-0 border-2 border-purdue-gold">
                      <span className="text-purdue-black font-bold text-xl">
                        {contact.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  {/* Contact Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-purdue-black text-base truncate">{contact.name}</h3>
                        <p className="text-sm text-gray-600 mt-1 truncate">{contact.title}</p>
                        <p className="text-sm text-purdue-gold font-medium truncate">{contact.company}</p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill={i < contact.rating ? "#CFB991" : "none"}
                            stroke={i < contact.rating ? "#CFB991" : "#D1D5DB"}
                            strokeWidth="2"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {contact.tags && contact.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-purdue-gold text-purdue-black text-xs rounded">
                      {tag}
                    </span>
                  ))}
                  {contact.isPurdueGrad && (
                    <span className="px-2 py-1 bg-purdue-black text-purdue-gold text-xs rounded">
                      Purdue {contact.graduationYear}
                    </span>
                  )}
                  {contact.connectionDegree && (
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                      {contact.connectionDegree}
                    </span>
                  )}
                </div>

                {contact.comments && (
                  <p className="text-sm text-gray-600 mb-3 italic">"{contact.comments}"</p>
                )}

                <div className="flex gap-2">
                  <a
                    href={contact.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-1.5 bg-blue-600 text-white text-xs rounded
                               hover:bg-blue-700 transition-colors"
                  >
                    View Profile
                  </a>
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${contact.name}?`)) {
                        deleteContact(contact.id)
                      }
                    }}
                    className="px-3 py-1.5 bg-red-500 text-white text-xs rounded
                               hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default IndexPopup
