const Navbar = () => {
  return (
    <div className='navbar bg-base-100 shadow-sm'>
      <div className='flex-1'>
        <a className='btn btn-ghost text-xl'>RestJAM</a>
      </div>
      <div className='flex gap-2'>
        <input
          type='text'
          placeholder='Search'
          className='input input-bordered w-24 md:w-auto'
        />
        <div className='navbar-end'>
          <a
            href='/login'
            className='btn'
          >
            Login/Signup
          </a>
        </div>
      </div>
    </div>
  )
}

export default Navbar
