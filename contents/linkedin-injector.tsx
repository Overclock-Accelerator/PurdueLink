import type { PlasmoCSConfig } from "plasmo"
import { useState } from "react"
import cssText from "data-text:~style.css"
import type { FC } from "react"
import ProfileModal from "~components/ProfileModal"

export const config: PlasmoCSConfig = {
  matches: ["https://www.linkedin.com/in/*"],
  all_frames: false
}

// Mount the button near the profile actions
export const getInlineAnchor = async () => {
  // Wait for LinkedIn to load
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Look for the actions container with Follow/Message buttons
  const actionsContainer = document.querySelector('.pv-top-card-v2-ctas')
  if (actionsContainer) {
    return actionsContainer
  }
  
  // Fallback: Look for any button container in profile
  const fallbackSelectors = [
    'div[class*="pv-top-card"]',
    '.pv-text-details__left-panel',
    'section.artdeco-card',
  ]
  
  for (const selector of fallbackSelectors) {
    const element = document.querySelector(selector)
    if (element) {
      return element
    }
  }
  
  return document.body
}

export const getShadowHostId = () => "purdue-link-button"

// Position inline with the action buttons and include Tailwind styles
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = `
    ${cssText}
    
    #purdue-link-button {
      display: inline-block !important;
      margin-left: 8px !important;
      vertical-align: middle !important;
    }
  `
  return style
}

// Button component that gets injected into LinkedIn
const PurdueLinkButton: FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2.5 bg-purdue-gold text-purdue-black font-semibold rounded-lg 
                 hover:bg-purdue-gold-light hover:shadow-lg hover:shadow-purdue-gold/50 
                 transition-all duration-200 ease-in-out
                 border-2 border-purdue-black
                 flex items-center gap-2"
      style={{
        fontFamily: 'Inter, Roboto, sans-serif',
        fontSize: '14px',
        fontWeight: 600
      }}
    >
      <span>Add to PurdueLink!</span>
    </button>
  )
}

const LinkedInInjector = () => {
  const [showModal, setShowModal] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)

  const extractProfileData = () => {
    // Extract profile data from LinkedIn DOM
    const data = {
      name: extractName(),
      title: extractTitle(),
      company: extractCompany(),
      location: extractLocation(),
      isPurdueGrad: checkPurdueGrad(),
      graduationYear: extractGraduationYear(),
      linkedinUrl: window.location.href,
      connectionDegree: extractConnectionDegree(),
      profileImageUrl: extractProfileImage(),
    }
    
    return data
  }

  const extractName = (): string => {
    // Try multiple selectors for name
    const selectors = [
      'h1.text-heading-xlarge',
      'h1[class*="inline"]',
      '.pv-text-details__left-panel h1',
      '.ph5 h1'
    ]
    
    for (const selector of selectors) {
      const element = document.querySelector(selector)
      if (element?.textContent?.trim()) {
        return element.textContent.trim()
      }
    }
    
    return ''
  }

  const extractTitle = (): string => {
    // Try multiple selectors for title/headline
    const selectors = [
      '.text-body-medium.break-words',
      '.pv-text-details__left-panel .text-body-medium',
      'div[class*="headline"]',
      '.ph5 .text-body-medium'
    ]
    
    for (const selector of selectors) {
      const element = document.querySelector(selector)
      if (element?.textContent?.trim()) {
        return element.textContent.trim()
      }
    }
    
    return ''
  }

  const extractCompany = (): string => {
    // Look for the first experience entry
    const experienceSection = document.querySelector('#experience')?.parentElement
    if (experienceSection) {
      const companyElement = experienceSection.querySelector('span[aria-hidden="true"]')
      if (companyElement?.textContent?.trim()) {
        return companyElement.textContent.trim()
      }
    }
    
    // Fallback: look for company in title
    const title = extractTitle()
    const atIndex = title.indexOf(' at ')
    if (atIndex > -1) {
      return title.substring(atIndex + 4).trim()
    }
    
    return ''
  }

  const extractLocation = (): string => {
    // Try multiple selectors for location
    const selectors = [
      '.pv-text-details__left-panel .text-body-small',
      'span[class*="location"]',
      '.ph5 .text-body-small.inline'
    ]
    
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector)
      for (const element of Array.from(elements)) {
        const text = element.textContent?.trim() || ''
        // Location usually contains city/state/country
        if (text && (text.includes(',') || text.includes('Area'))) {
          return text
        }
      }
    }
    
    return ''
  }

  const checkPurdueGrad = (): boolean => {
    const educationSection = document.querySelector('#education')?.parentElement
    if (educationSection) {
      const text = educationSection.textContent || ''
      return text.toLowerCase().includes('purdue')
    }
    return false
  }

  const extractGraduationYear = (): string => {
    const educationSection = document.querySelector('#education')?.parentElement
    if (educationSection) {
      const text = educationSection.textContent || ''
      
      // Look for Purdue and then find year nearby
      if (text.toLowerCase().includes('purdue')) {
        // Match 4-digit years (e.g., 2006, 1995-1999, 2020-2024)
        const yearMatch = text.match(/\b(19|20)\d{2}\b/)
        if (yearMatch) {
          return yearMatch[0]
        }
      }
    }
    return ''
  }

  const extractConnectionDegree = (): string => {
    // Look for connection badge
    const selectors = [
      '.dist-value',
      'span[class*="distance-badge"]',
      'span.dist-value'
    ]
    
    for (const selector of selectors) {
      const element = document.querySelector(selector)
      if (element?.textContent?.trim()) {
        return element.textContent.trim()
      }
    }
    
    // Look for text like "1st", "2nd", "3rd"
    const pageText = document.body.textContent || ''
    const degreeMatch = pageText.match(/\b(1st|2nd|3rd)\b/)
    if (degreeMatch) {
      return degreeMatch[0] + ' Level'
    }
    
    return ''
  }

  const extractProfileImage = (): string => {
    // Try to find the profile image
    const selectors = [
      'img[class*="pv-top-card-profile-picture"]',
      'img.profile-photo-edit__preview',
      '.pv-top-card--photo img',
      'button[aria-label*="View"] img',
      '.pv-top-card__photo img'
    ]
    
    for (const selector of selectors) {
      const img = document.querySelector(selector) as HTMLImageElement
      if (img?.src) {
        return img.src
      }
    }
    
    // Fallback: look for any large image in the profile header
    const allImages = document.querySelectorAll('img')
    for (const img of Array.from(allImages)) {
      const src = img.src
      // LinkedIn profile images usually contain these patterns
      if (src && (src.includes('profile') || src.includes('media'))) {
        const width = img.width || img.naturalWidth
        const height = img.height || img.naturalHeight
        // Profile images are usually at least 100x100
        if (width >= 100 && height >= 100) {
          return src
        }
      }
    }
    
    return ''
  }

  const handleAddClick = () => {
    const data = extractProfileData()
    setProfileData(data)
    setShowModal(true)
  }

  return (
    <>
      <div
        style={{
          display: 'inline-block',
          marginLeft: '12px'
        }}
      >
        <PurdueLinkButton onClick={handleAddClick} />
      </div>
      
      {showModal && profileData && (
        <ProfileModal
          data={profileData}
          onClose={() => setShowModal(false)}
          onSave={async (contactData) => {
            // Save to Chrome storage
            const { contacts = [] } = await chrome.storage.local.get('contacts')
            const newContact = {
              ...contactData,
              id: Date.now().toString(),
              dateAdded: new Date().toISOString()
            }
            await chrome.storage.local.set({
              contacts: [...contacts, newContact]
            })
            
            // Show success message
            alert('Contact saved to PurdueLink!')
          }}
        />
      )}
    </>
  )
}

export default LinkedInInjector

