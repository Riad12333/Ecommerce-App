import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className='bg-white pt-16 pb-8 border-t border-gray-100 font-body text-text-main'>
      <div className='container mx-auto px-4 md:px-8'>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className='flex flex-col'>
              <h3 className="text-2xl font-bold font-heading text-primary leading-none">Madjid<span className='text-accent'></span></h3>
              <span className='text-xs text-text-secondary font-medium tracking-wider'>Shop Here</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">Your one-stop destination for all things tech. We provide the latest gadgets at unbeatable prices with top-notch customer support.</p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-all"><FaFacebook /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-all"><FaInstagram /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-all"><FaTwitter /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-all"><FaLinkedin /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 text-text-secondary text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="font-bold text-lg mb-6">Help & Support</h4>
            <ul className="space-y-3 text-text-secondary text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-6">Stay Updated</h4>
            <p className="text-text-secondary text-sm mb-4">Subscribe to our newsletter for the latest tech news and exclusive offers.</p>
            <form className="flex flex-col gap-3">
              <input type="email" placeholder="Enter your email" className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary bg-background" />
              <button className="bg-primary hover:bg-primary-light text-white font-semibold py-2 rounded-lg transition-colors">Subscribe</button>
            </form>
          </div>
        </div>

        <div className='border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-sm text-text-secondary'>&copy; {new Date().getFullYear()} Madjid. All rights reserved.</p>
          <div className="flex gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6 opacity-60 grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-60 grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-6 opacity-60 grayscale hover:grayscale-0 transition-all" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
