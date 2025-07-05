import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import api from "../api"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const data = await api.loginUser({ email, password })
      console.log("DATA SAU LOGIN:", data)

      if (data.accessToken) {
        const decoded = jwtDecode(data.accessToken)
        console.log("→ payload:", decoded)

        if (decoded.isAdmin) {
          localStorage.setItem("adminToken", data.accessToken)
          localStorage.setItem("adminUser", JSON.stringify(jwtDecode(data.accessToken)))
          console.log("1", data.accessToken);
          console.log("2", JSON.stringify(jwtDecode(data.accessToken)));
          navigate("/")
        } else {
          alert("Bạn không có quyền truy cập admin.")
        }
      } else {
        alert("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Có lỗi xảy ra trong quá trình đăng nhập.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          padding: '40px 30px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            backdropFilter: 'blur(10px)'
          }}>
            <i className="fas fa-user-shield" style={{fontSize: '32px'}}></i>
          </div>
          <h2 style={{margin: 0, fontWeight: '600', fontSize: '24px'}}>
            Admin Panel
          </h2>
          <p style={{margin: '8px 0 0', opacity: '0.9', fontSize: '14px'}}>
            Đăng nhập để tiếp tục
          </p>
        </div>

        {/* Form */}
        <div style={{padding: '40px 30px'}}>
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom: '25px'}}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#374151',
                fontSize: '14px'
              }}>
                <i className="fas fa-envelope" style={{marginRight: '8px', color: '#6b7280'}}></i>
                Địa chỉ Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            
            <div style={{marginBottom: '30px'}}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#374151',
                fontSize: '14px'
              }}>
                <i className="fas fa-lock" style={{marginRight: '8px', color: '#6b7280'}}></i>
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 25px rgba(79, 70, 229, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Đăng nhập
                </>
              )}
            </button>
          </form>
          
          <div style={{
            marginTop: '30px',
            textAlign: 'center',
            padding: '20px',
            background: '#f8fafc',
            borderRadius: '12px'
          }}>
            <i className="fas fa-shield-alt" style={{color: '#4f46e5', marginRight: '8px'}}></i>
            <span style={{color: '#6b7280', fontSize: '14px'}}>
              Chỉ dành cho quản trị viên
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 30px',
          background: '#f8fafc',
          textAlign: 'center',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{margin: 0, color: '#9ca3af', fontSize: '12px'}}>
            © 2025 Fashion Store Admin Panel
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}