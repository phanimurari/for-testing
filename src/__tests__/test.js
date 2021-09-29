import {BrowserRouter} from 'react-router-dom'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import Cookies from 'js-cookie'

import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../App'

const websiteLogo = 'https://assets.ccbp.in/frontend/react-js/logo-img.png'
const errorView = 'https://assets.ccbp.in/frontend/react-js/failure-img.png'
const noJobsView = 'https://assets.ccbp.in/frontend/react-js/no-jobs-img.png'
const loginRoutePath = '/login'
const jobsRoutePath = '/jobs'
const homeRoutePath = '/'

const mockGetCookie = (returnToken = true) => {
  let mockedGetCookie
  if (returnToken) {
    mockedGetCookie = jest.fn(() => ({
      jwt_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhamEiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTYxOTY5MTMwN30.T--R95wvSdSpRlHWeKGbP3yTSq2wk196PqpqUamuM_g',
    }))
  } else {
    mockedGetCookie = jest.fn(() => undefined)
  }
  jest.spyOn(Cookies, 'get')
  Cookies.get = mockedGetCookie
}

const restoreGetCookieFns = () => {
  Cookies.get.mockRestore()
}

const renderWithBrowserRouter = (ui, {route = '/jobs'} = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, {wrapper: BrowserRouter})
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
const jobsResponse = {
  jobs: [
    {
      id: 101,
      title: 'Software Developer',
      rating: 202,
      company_name: 'Amazon',
      location: 'Hyderabad',
      employment_type: 'FULLTIME',
      job_description:
        'Amazon Lex is a platform for building conversational interfaces into any application. It provides the advanced deep learning functionalities of automatic speech recognition (ASR) for converting speech to text and natural language understanding (NLU) to recognize the intent of the text. Be a part of a well-balanced team with diverse experience.',
      package_per_annum: '25 LPA',
      company_logo_url:
        'https://assets.ccbp.in/frontend/react-js/jobby-app/netflix-img.png',
    },
    {
      id: 102,
      title: 'Hardware Developer',
      rating: 206,
      company_name: 'Amazon',
      location: 'Delhi',
      employment_type: 'PARTTIME',
      job_description:
        'Amazon Lex is a platform for building into any application. It provides the advanced deep learning functionalities of automatic speech recognition (ASR) for converting speech to text and natural language understanding (NLU) to recognize the intent of the text. Be a part of a well-balanced team with diverse experience.',
      package_per_annum: '26 LPA',
      company_logo_url:
        'https://assets.ccbp.in/frontend/react-js/jobby-app/facebook-img.png',
    },
  ],
  total: 2,
}

const profileResponse = {
  profile_details: {
    name: 'Rahul Attuluri',
    profile_image_url:
      'https://assets.ccbp.in/frontend/react-js/male-avatar-img.png',
    short_bio: 'Lead Hardware Developer and AI-ML expert',
  },
}

const jobDetailsResponse = {
  job_details: {
    id: 101,
    title: '101 title',
    rating: 202,
    company_name: 'Amazon',
    company_website_url: 'https://www.w3schools.com',
    location: 'MUMBAI',
    employment_type: 'FREELANCE',
    job_description: '101 some random description',
    package_per_annum: '10 LPA',
    company_logo_url:
      'https://assets.ccbp.in/frontend/react-js/jobby-app/netflix-img.png',
    skills: [
      {
        name: 'HTML',
        image_url:
          'https://assets.ccbp.in/frontend/react-js/jobby-app/html-img.png',
      },
      {
        name: 'CSS',
        image_url:
          'https://assets.ccbp.in/frontend/react-js/jobby-app/css-img.png',
      },
    ],
    life_at_company: {
      description: 'string',
      image_url:
        'https://assets.ccbp.in/frontend/react-js/jobby-app/life-netflix-img.png',
    },
  },
  similar_jobs: [
    {
      id: 103,
      title: '103 title',
      company_name: 'Amazon',
      company_logo_url:
        'https://assets.ccbp.in/frontend/react-js/jobby-app/netflix-img.png',
      location: 'BANGALORE',
      employment_type: 'FULLTIME',
      job_description: '103 some random description',
      rating: 206,
    },
    {
      id: 107,
      title: '107 title',
      company_name: 'Amazon',
      company_logo_url:
        'https://assets.ccbp.in/frontend/react-js/jobby-app/netflix-img.png',
      location: 'CHENNAI',
      employment_type: 'PARTTIME',
      job_description: '107 some random description',
      rating: 214,
    },
    {
      id: 109,
      title: '109 title',
      company_name: 'Amazon',
      company_logo_url:
        'https://assets.ccbp.in/frontend/react-js/jobby-app/netflix-img.png',
      location: 'HYDERABAD',
      employment_type: 'INTERNSHIP',
      job_description: '109 some random description',
      rating: 218,
    },
  ],
}

const profileApiUrl = 'https://apis.ccbp.in/profile'
const jobsApiUrl = 'https://apis.ccbp.in/jobs'
const jobDetailsApiUrl = 'https://apis.ccbp.in/jobs/:id'

const handlers = [
  rest.get(profileApiUrl, (req, res, ctx) => res(ctx.json(profileResponse))),
  rest.get(jobsApiUrl, (req, res, ctx) => res(ctx.json(jobsResponse))),
  rest.get(jobDetailsApiUrl, (req, res, ctx) =>
    res(ctx.json(jobDetailsResponse)),
  ),
]

const server = setupServer(...handlers)

const originalConsoleError = console.error
const originalFetch = window.fetch

describe(':::RJSCPAW11J_TEST_SUITE_3:::Jobs Route tests', () => {
  beforeAll(() => {
    server.listen()
  })

  afterAll(() => {
    server.close()
  })

  afterEach(() => {
    server.resetHandlers()
    console.error = originalConsoleError
    window.fetch = originalFetch
  })

  it(':::RJSCPAW11J_TEST_51:::Page should consist of at least two HTML list items and the employmentTypesList, salaryRangesList, JobsList should be rendered using a unique key as a prop for each employmentType item and salaryRange item and Job item respectively:::5:::', async () => {
    mockGetCookie()
    console.error = message => {
      if (
        /Each child in a list should have a unique "key" prop/.test(message) ||
        /Encountered two children with the same key/.test(message)
      ) {
        throw new Error(message)
      }
    }
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(2)
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_52:::When the "/jobs" is provided in the URL by an unauthenticated user then the page should be navigated to Login Route:::5:::', () => {
    mockGetCookie(false)
    renderWithBrowserRouter(<App />)
    expect(window.location.pathname).toBe(loginRoutePath)
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_53:::When the "/jobs" is provided in the URL by an authenticated user then the page should be navigated to Jobs Route:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    expect(window.location.pathname).toBe(jobsRoutePath)
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_54:::Jobs Route should consist of an HTML image element with alt text as "website logo" and src as given logo URL:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    const imageEls = screen.getAllByRole('img', {
      name: /website logo/i,
      exact: false,
    })
    expect(imageEls[0]).toBeInTheDocument()
    expect(imageEls[0].src).toBe(websiteLogo)
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_55:::Jobs Route should consist of HTML input element with type attribute value as "search":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    const searchEls = screen.getAllByRole('searchbox')
    expect(searchEls.length).toBeGreaterThanOrEqual(1)
    expect(searchEls[0].type).toBe('search')

    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_56:::Jobs Route should consist of HTML button element with testid attribute value as searchButton:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    const searchBtnEls = screen.getAllByTestId('searchButton')
    expect(searchBtnEls.length).toBeGreaterThanOrEqual(1)
    expect(searchBtnEls[0].type).toBe('button')

    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_57:::When the Jobs Route is opened, then the page should consist of at least three HTML unordered list elements to display employmentTypes, salaryRanges and, jobs:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    const unorderedLists = await screen.findAllByRole('list')
    expect(unorderedLists.length).toBeGreaterThanOrEqual(3)
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_58:::Jobs Route should consist of HTML main heading element with text content as "Type of Employment":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {name: /Type of Employment/i, exact: false}),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_59:::Jobs Route should consist of HTML checkboxes and Label elements with text content as the value of the key "label" in each item from employmentTypesList provided:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', {
        name: employmentTypesList[0].label,
        exact: false,
      }),
    ).toBeInTheDocument()
    const checkboxEl1 = screen.getByRole('checkbox', {
      name: employmentTypesList[1].label,
      exact: false,
    })
    expect(checkboxEl1).toBeInTheDocument()
    expect(
      screen.getByText(employmentTypesList[0].label, {exact: false}),
    ).toBeInTheDocument()
    expect(
      screen.getByText(employmentTypesList[0].label, {exact: false}).tagName,
    ).toBe('LABEL')
    expect(
      screen.getByText(employmentTypesList[1].label, {exact: false}),
    ).toBeInTheDocument()
    expect(
      screen.getByText(employmentTypesList[1].label, {exact: false}).tagName,
    ).toBe('LABEL')
    expect(
      screen.getByRole('checkbox', {
        name: employmentTypesList[2].label,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(employmentTypesList[2].label, {exact: false}),
    ).toBeInTheDocument()
    expect(
      screen.getByText(employmentTypesList[2].label, {exact: false}).tagName,
    ).toBe('LABEL')
    expect(
      screen.getByRole('checkbox', {
        name: employmentTypesList[3].label,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(employmentTypesList[3].label, {exact: false}),
    ).toBeInTheDocument()
    expect(
      screen.getByText(employmentTypesList[3].label, {exact: false}).tagName,
    ).toBe('LABEL')

    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_60:::Jobs Route should consist of HTML main heading element with text content as "Salary Range":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {name: /Salary Range/i, exact: false}),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_61:::Jobs Route should consist of HTML radio buttons and Label elements with text content as the value of the key "label" in each item from salaryRangesList provided:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('radio', {
        name: salaryRangesList[0].label,
        exact: false,
      }),
    ).toBeInTheDocument()
    const labelEl1 = screen.getByText(salaryRangesList[0].label, {exact: false})
    expect(labelEl1).toBeInTheDocument()
    expect(labelEl1.tagName).toBe('LABEL')
    expect(
      screen.getByRole('radio', {
        name: salaryRangesList[1].label,
        exact: false,
      }),
    ).toBeInTheDocument()
    const labelEl2 = screen.getByText(salaryRangesList[1].label, {exact: false})
    expect(labelEl2).toBeInTheDocument()
    expect(labelEl2.tagName).toBe('LABEL')
    expect(
      screen.getByRole('radio', {
        name: salaryRangesList[0].label,
        exact: false,
      }),
    ).toBeInTheDocument()
    const labelEl3 = screen.getByText(salaryRangesList[2].label, {exact: false})
    expect(labelEl3).toBeInTheDocument()
    expect(labelEl3.tagName).toBe('LABEL')
    expect(
      screen.getByRole('radio', {
        name: salaryRangesList[0].label,
        exact: false,
      }),
    ).toBeInTheDocument()
    const labelEl4 = screen.getByText(salaryRangesList[3].label, {exact: false})
    expect(labelEl4).toBeInTheDocument()
    expect(labelEl4.tagName).toBe('LABEL')
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_62:::Jobs Route should use the profileApiUrl for getting the profile data by using fetch network call:::5:::', async () => {
    mockGetCookie()
    const mockFetchFunction = jest.fn().mockImplementation(url => {
      if (url === profileApiUrl) {
        return {
          ok: true,
          json: () => Promise.resolve(profileResponse),
        }
      }
      return {
        ok: true,
        json: () => Promise.resolve(jobsResponse),
      }
    })
    window.fetch = mockFetchFunction
    renderWithBrowserRouter(<App />)
    expect(mockFetchFunction.mock.calls[0][0]).toBe(`${profileApiUrl}`)
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_63:::Jobs Route should use the jobsApiUrl for getting the jobs data by using fetch network call:::5:::', async () => {
    mockGetCookie()
    const mockFetchFunction = jest.fn().mockImplementation(url => {
      if (url === profileApiUrl) {
        return {
          ok: true,
          json: () => Promise.resolve(profileResponse),
        }
      }
      return {
        ok: true,
        json: () => Promise.resolve(jobsResponse),
      }
    })
    window.fetch = mockFetchFunction
    renderWithBrowserRouter(<App />)
    expect(mockFetchFunction.mock.calls[1][0]).toMatch(`${jobsApiUrl}`)
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_64:::When the Jobs Route is accessed, it should contain an HTML container element with testid attribute value as the "loader":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    await waitForElementToBeRemoved(() => screen.queryAllByTestId('loader'))
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_65:::When the Jobs Route is opened, then the page should consist of an HTML image element with alt text as "profile" and src as the value of key "profile_image_url" in profile_details from the profileResponse:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    const imgEl = await screen.findByRole('img', {
      name: /profile/i,
      exact: true,
    })
    expect(imgEl).toBeInTheDocument()
    expect(imgEl.src).toBe(profileResponse.profile_details.profile_image_url)

    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_66:::When the Jobs Route is opened, then the page should consist of an HTML main heading element with text content as the values of the key "name" in profile_details from the profileResponse:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    expect(
      await screen.getByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()

    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_67:::When the Jobs Route is opened, then the page should consist of an HTML paragraph element with text content as the values of the key "short_bio" in profile_details from the profileResponse:::5:::', async () => {
    mockGetCookie()

    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    const paragraphEl = await screen.getByText(
      profileResponse.profile_details.short_bio,
      {
        exact: false,
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_68:::When the Jobs Route is opened, an HTTP GET request should be made to jobsApiUrl with all the query parameters and their initial values:::5:::', async () => {
    mockGetCookie()
    const mockFetchFunction = jest.fn().mockImplementation(url => {
      if (url === profileApiUrl) {
        return {
          ok: true,
          json: () => Promise.resolve(profileResponse),
        }
      }
      return {
        ok: true,
        json: () => Promise.resolve(jobsResponse),
      }
    })
    window.fetch = mockFetchFunction
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    expect(mockFetchFunction.mock.calls[1][0]).toMatch('search=')
    expect(mockFetchFunction.mock.calls[1][0]).toMatch('employment_type=')
    expect(mockFetchFunction.mock.calls[1][0]).toMatch('minimum_package=')
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_69:::When the Jobs Route is opened, then the page should consist of the HTML image element with alt text as "company logo" and src as the value of key "company_logo_url" in jobs from the jobsResponse:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    const imgEl = await screen.findAllByRole('img', {
      name: /company logo/i,
      exact: false,
    })
    expect(imgEl.length).toBeGreaterThanOrEqual(2)
    expect(imgEl[0].src).toBe(jobsResponse.jobs[0].company_logo_url)
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_70:::When the Jobs Route is opened, then the page should consist of the HTML main heading element with text content as the value of the key "title" in each item from the jobsResponse:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('heading', {
        name: jobsResponse.jobs[1].title,
        exact: false,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_71:::When the Jobs Route is opened, then the page should consist of the HTML paragraph element with text content as the value of the key "rating" in each item from the jobsResponse:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    const paragraphEl1 = await screen.findByText(jobsResponse.jobs[0].rating, {
      exact: false,
    })
    expect(paragraphEl1).toBeInTheDocument()
    expect(paragraphEl1.tagName).toBe('P')
    const paragraphEl2 = await screen.findByText(jobsResponse.jobs[1].rating, {
      exact: false,
    })
    expect(paragraphEl2).toBeInTheDocument()
    expect(paragraphEl2.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_72:::When the Jobs Route is opened, then the page should consist of the HTML paragraph element with text content as the value of the key "location" in each item from the jobsResponse:::5:::', async () => {
    mockGetCookie()

    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    const paragraphEl1 = await screen.findByText(
      jobsResponse.jobs[0].location,
      {
        exact: false,
      },
    )
    expect(paragraphEl1).toBeInTheDocument()
    expect(paragraphEl1.tagName).toBe('P')
    const paragraphEl2 = await screen.findByText(
      jobsResponse.jobs[1].location,
      {
        exact: false,
      },
    )
    expect(paragraphEl2).toBeInTheDocument()
    expect(paragraphEl2.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_73:::When the Jobs Route is opened, then the page should consist of the HTML paragraph element with text content as the value of the key "employment_type" in each item from the jobsResponse:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    const paragraphEl1 = await screen.findByText(
      jobsResponse.jobs[0].employment_type,
      {
        exact: false,
      },
    )
    expect(paragraphEl1).toBeInTheDocument()
    expect(paragraphEl1.tagName).toBe('P')
    const paragraphEl2 = await screen.findByText(
      jobsResponse.jobs[1].employment_type,
      {
        exact: false,
      },
    )
    expect(paragraphEl2).toBeInTheDocument()
    expect(paragraphEl2.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_74:::When the Jobs Route is opened, then the page should consist of at least one HTML main heading element with text content as the "Description":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    const headingEls = await screen.findAllByRole('heading', {
      name: /Description/i,
      exact: false,
    })
    expect(headingEls.length).toBeGreaterThanOrEqual(1)
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_75:::When the Jobs Route is opened, then the page should consist of the HTML paragraph element with text content as the value of the key "job_description" in each item from the jobsResponse:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    const paragraphEl1 = await screen.findByText(
      jobsResponse.jobs[0].job_description,
      {
        exact: false,
      },
    )
    expect(paragraphEl1).toBeInTheDocument()
    expect(paragraphEl1.tagName).toBe('P')
    const paragraphEl2 = await screen.findByText(
      jobsResponse.jobs[1].job_description,
      {
        exact: false,
      },
    )
    expect(paragraphEl2).toBeInTheDocument()
    expect(paragraphEl2.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_76:::When the Home link in the Header is clicked, then the page should be navigated to Home Route:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    const homeLink = screen.getAllByRole('link', {
      name: /home/i,
      exact: false,
    })
    userEvent.click(homeLink[0])
    expect(window.location.pathname).toBe(homeRoutePath)
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_77:::When the website logo in the Header is clicked, then the page should be navigated to Home Route:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    const imageEls = screen.getAllByRole('img', {
      name: /website logo/i,
      exact: false,
    })
    userEvent.click(imageEls[0])
    expect(window.location.pathname).toBe(homeRoutePath)
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_78:::When a value is provided in the HTML input element for search and the Enter key is pressed, an HTTP GET request should be made with the value provided in the HTML input element as the value to query parameter "search":::5:::', async () => {
    mockGetCookie()
    const mockFetchFunction = jest.fn().mockImplementation(url => {
      if (url === profileApiUrl) {
        return {
          ok: true,
          json: () => Promise.resolve(profileResponse),
        }
      }
      return {
        ok: true,
        json: () => Promise.resolve(jobsResponse),
      }
    })
    window.fetch = mockFetchFunction
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    userEvent.type(screen.getAllByRole('searchbox')[0], 'Dev')
    userEvent.click(screen.getAllByTestId('searchButton')[0])
    expect(mockFetchFunction.mock.calls[2][0]).toMatch('search=Dev')
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_79:::When employment types are selected, an HTTP GET request should be made with the ids of the employment types  as a single string separated by "," as value to query parameter "employment_type":::5:::', async () => {
    mockGetCookie()
    const mockFetchFunction = jest.fn().mockImplementation(url => {
      if (url === profileApiUrl) {
        return {
          ok: true,
          json: () => Promise.resolve(profileResponse),
        }
      }
      return {
        ok: true,
        json: () => Promise.resolve(jobsResponse),
      }
    })
    window.fetch = mockFetchFunction
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    userEvent.click(screen.getByLabelText(/Full Time/i, {exact: false}))
    userEvent.click(screen.getByLabelText(/Part Time/i, {exact: false}))
    expect(mockFetchFunction.mock.calls[3][0]).toMatch(
      'employment_type=FULLTIME,PARTTIME',
    )
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_80:::When a salary range is clicked, an HTTP GET request should be made with the id of the salaryRange as value to query parameter "minimum_package":::5:::', async () => {
    mockGetCookie()
    const mockFetchFunction = jest.fn().mockImplementation(url => {
      if (url === profileApiUrl) {
        return {
          ok: true,
          json: () => Promise.resolve(profileResponse),
        }
      }
      return {
        ok: true,
        json: () => Promise.resolve(jobsResponse),
      }
    })
    window.fetch = mockFetchFunction
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    userEvent.click(screen.getByText(/10 LPA/i, {exact: false}))
    expect(mockFetchFunction.mock.calls[2][0]).toMatch(
      'minimum_package=1000000',
    )
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_81:::When all filters are used, an HTTP GET request should be made to jobsApiUrl with all the query parameters and their values:::5:::', async () => {
    mockGetCookie()
    const mockFetchFunction = jest.fn().mockImplementation(url => {
      if (url === profileApiUrl) {
        return {
          ok: true,
          json: () => Promise.resolve(profileResponse),
        }
      }
      return {
        ok: true,
        json: () => Promise.resolve(jobsResponse),
      }
    })
    window.fetch = mockFetchFunction
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    userEvent.type(screen.getAllByRole('searchbox')[0], 'Dev')
    userEvent.click(screen.getAllByTestId('searchButton')[0])
    userEvent.click(screen.getByLabelText(/Full Time/i, {exact: false}))
    userEvent.click(screen.getByText(/10 LPA/i, {exact: false}))
    expect(mockFetchFunction.mock.calls[4][0]).toMatch('search=Dev')
    expect(mockFetchFunction.mock.calls[4][0]).toMatch(
      'employment_type=FULLTIME',
    )
    expect(mockFetchFunction.mock.calls[4][0]).toMatch(
      'minimum_package=1000000',
    )
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_82:::When a Job Item is clicked in Jobs Route, then the page should be navigated to the Job Item Details route with "/jobs/:id" in the URL path:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    const headingEl = await screen.findByText(jobsResponse.jobs[0].title, {
      exact: false,
    })
    expect(headingEl).toBeInTheDocument()
    userEvent.click(headingEl)
    expect(window.location.pathname).toMatch('jobs/101')
    expect(
      await screen.findByText(
        jobDetailsResponse.job_details.life_at_company.description,
        {
          exact: false,
        },
      ),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_83:::When the HTTP GET request made to jobsApiUrl returns the jobs list as empty, then the page should consist of the HTML image element with alt text as "no jobs" and src as the given "No Jobs view image URL":::5:::', async () => {
    mockGetCookie()
    const mockFetchFunction = jest.fn().mockImplementation(url => {
      if (url === profileApiUrl) {
        return {
          ok: true,
          json: () => Promise.resolve(profileResponse),
        }
      }
      return {
        ok: true,
        json: () => Promise.resolve({jobs: []}),
      }
    })
    window.fetch = mockFetchFunction
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    const imgEl = await screen.getByRole('img', {
      name: /no jobs/i,
      exact: false,
    })
    expect(imgEl).toBeInTheDocument()
    expect(imgEl.src).toBe(noJobsView)
    window.fetch = originalFetch
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_84:::When the HTTP GET request made to jobsApiUrl returns the jobs list as empty, then the page should consist of the HTML main heading element with text content as "No Jobs Found":::5:::', async () => {
    mockGetCookie()
    const mockFetchFunction = jest.fn().mockImplementation(url => {
      if (url === profileApiUrl) {
        return {
          ok: true,
          json: () => Promise.resolve(profileResponse),
        }
      }
      return {
        ok: true,
        json: () => Promise.resolve({jobs: []}),
      }
    })
    window.fetch = mockFetchFunction
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(
      await screen.getByRole('heading', {name: /No Jobs Found/i}),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_85:::When the HTTP GET request made to jobsApiUrl returns the jobs list as empty, then the page should consist of the HTML paragraph element with text content as "We could not find any jobs. Try other filters":::5:::', async () => {
    mockGetCookie()
    const mockFetchFunction = jest.fn().mockImplementation(url => {
      if (url === profileApiUrl) {
        return {
          ok: true,
          json: () => Promise.resolve(profileResponse),
        }
      }
      return {
        ok: true,
        json: () => Promise.resolve({jobs: []}),
      }
    })
    window.fetch = mockFetchFunction
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    const paragraphEl = await screen.getByText(
      /We could not find any jobs. Try other filters/i,
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_86:::When the Profile HTTP GET request made is unsuccessful, then the page should consist of the HTML button element with text content as the "Retry":::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(profileApiUrl, (req, res, ctx) => {
        return res(ctx.status(400))
      }),
    )
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    expect(
      await screen.getByRole('button', {name: /Retry/i, exact: false}),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_87:::When the Jobs HTTP GET request made is unsuccessful, then the page should consist of the HTML image element with alt text as "failure view" and src as the given Failure view image URL:::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(jobsApiUrl, (req, res, ctx) => {
        return res(ctx.status(400))
      }),
    )
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    const imgEl = await screen.findByRole('img', {
      name: /failure view/i,
      exact: false,
    })
    expect(imgEl).toBeInTheDocument()
    expect(imgEl.src).toBe(errorView)
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_88:::When the Jobs HTTP GET request made is unsuccessful, then the page should consist of the HTML main heading element with text content as "Oops! Something Went Wrong":::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(jobsApiUrl, (req, res, ctx) => {
        return res(ctx.status(400))
      }),
    )
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('heading', {
        name: /Oops! Something Went Wrong/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_89:::When the Jobs HTTP GET request made is unsuccessful, then the page should consist of the HTML paragraph element with text content as "We cannot seem to find the page you are looking for":::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(jobsApiUrl, (req, res, ctx) => {
        return res(ctx.status(400))
      }),
    )
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    const paragraphEl = await screen.findByText(
      /We cannot seem to find the page you are looking for/i,
      {
        exact: false,
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_90:::When the Jobs HTTP GET request made is unsuccessful, then the page should consist of the HTML button element with text content as the "Retry":::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(jobsApiUrl, (req, res, ctx) => {
        return res(ctx.status(400))
      }),
    )
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('button', {name: /Retry/i, exact: false}),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_91:::When the Profile HTTP GET request made is unsuccessful and "Retry" button is clicked, then an HTTP GET request should be made to profileApiUrl:::5:::', async () => {
    mockGetCookie()
    const mockFetchFunction = jest.fn().mockImplementation(url => {
      if (url === profileApiUrl) {
        return {
          ok: false,
          json: () => Promise.resolve(profileResponse),
        }
      }
      return {
        ok: true,
        json: () => Promise.resolve(jobsResponse),
      }
    })
    window.fetch = mockFetchFunction
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByText(jobsResponse.jobs[0].title, {exact: false}),
    ).toBeInTheDocument()
    const buttonEl = await screen.findByRole('button', {
      name: /Retry/i,
      exact: false,
    })
    expect(buttonEl).toBeInTheDocument()
    userEvent.click(buttonEl)
    expect(mockFetchFunction.mock.calls[2][0]).toBe(`${profileApiUrl}`)
    restoreGetCookieFns()
  })

  it(':::RJSCPAW11J_TEST_92:::When the Jobs HTTP GET request made is unsuccessful and "Retry" button is clicked, then an HTTP GET request should be made to jobsApiUrl:::5:::', async () => {
    mockGetCookie()
    const mockFetchFunction = jest.fn().mockImplementation(url => {
      if (url === profileApiUrl) {
        return {
          ok: true,
          json: () => Promise.resolve(profileResponse),
        }
      }
      return {
        ok: false,
        json: () => Promise.resolve(jobsResponse),
      }
    })
    window.fetch = mockFetchFunction
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: profileResponse.profile_details.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    const buttonEl = await screen.getByRole('button', {
      name: /Retry/i,
      exact: false,
    })
    expect(buttonEl).toBeInTheDocument()
    userEvent.click(buttonEl)
    expect(mockFetchFunction.mock.calls[2][0]).toMatch(`${jobsApiUrl}`)
    window.fetch = originalFetch
    restoreGetCookieFns()
  })
})
