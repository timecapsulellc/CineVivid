import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '../pages/index'

describe('Home Component', () => {
  it('renders the CineVivid title', () => {
    render(<Home />)
    expect(screen.getByText('🎬 CineVivid')).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    render(<Home />)
    expect(screen.getByText('AI Video Creation Made Simple')).toBeInTheDocument()
  })

  it('renders the prompt input field', () => {
    render(<Home />)
    const textarea = screen.getByLabelText(/describe your video/i)
    expect(textarea).toBeInTheDocument()
  })

  it('renders the generate button', () => {
    render(<Home />)
    const button = screen.getByRole('button', { name: /generate video/i })
    expect(button).toBeInTheDocument()
  })

  it('shows progress when generating', async () => {
    render(<Home />)
    const button = screen.getByRole('button', { name: /generate video/i })

    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/generating your video/i)).toBeInTheDocument()
    })
  })

  it('disables button when no prompt is entered', () => {
    render(<Home />)
    const button = screen.getByRole('button', { name: /generate video/i })
    expect(button).toBeDisabled()
  })

  it('enables button when prompt is entered', async () => {
    render(<Home />)
    const textarea = screen.getByLabelText(/describe your video/i)
    const button = screen.getByRole('button', { name: /generate video/i })

    await userEvent.type(textarea, 'A beautiful sunset')

    expect(button).not.toBeDisabled()
  })

  it('renders feature cards', () => {
    render(<Home />)
    expect(screen.getByText('Text to Video')).toBeInTheDocument()
    expect(screen.getByText('Image to Video')).toBeInTheDocument()
    expect(screen.getByText('AI Voiceover')).toBeInTheDocument()
    expect(screen.getByText('Video Editing')).toBeInTheDocument()
  })

  it('renders testimonials', () => {
    render(<Home />)
    expect(screen.getByText('What Creators Say')).toBeInTheDocument()
    expect(screen.getByText('Alex Chen')).toBeInTheDocument()
    expect(screen.getByText('Sarah Mitchell')).toBeInTheDocument()
  })
})