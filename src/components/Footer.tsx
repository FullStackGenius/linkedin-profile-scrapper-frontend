import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom'

const Footer = () => {
    const isAuthenticated = useSelector((state:any) => state.auth.isAuthenticated);
  return (
    <>
    <section className="bg-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Optimize Your LinkedIn Strategy?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of professionals using our platform to manage their LinkedIn data effectively.
          </p>
          {/* <NavLink
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Start Now'}
          </NavLink> */}
        </div>
      </section>
    </>
  )
}

export default Footer