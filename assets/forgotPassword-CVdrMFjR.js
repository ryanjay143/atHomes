import{r as o,u as g,j as e,F as m,h as w,B as x,e as j,d as p,S as f}from"./index-xsBp2E4G.js";import{c as v,C as y,a as N,d as k,b as C}from"./card-DKVU-Ubm.js";import{L as S}from"./label-4mP_r72_.js";import{I as E}from"./input-D9YYjcoe.js";function z(){const[a,n]=o.useState(""),[s,i]=o.useState(!1),[l,d]=o.useState(""),b=g(),h=async r=>{var c,u;if(r.preventDefault(),!a){d("Email is required.");return}if(!s){i(!0),d("");try{const t=await p.post("forgot-password",{email:a});f.fire({position:"center",icon:"success",title:"Success",text:t.data.status,showConfirmButton:!1,showCloseButton:!0,timer:3e3,timerProgressBar:!0}),n("")}catch(t){console.error("Error sending reset link:",t),f.fire({position:"center",icon:"error",title:"Oops!",text:p.isAxiosError(t)&&((u=(c=t.response)==null?void 0:c.data)!=null&&u.message)?t.response.data.message:"An error occurred. Please try again.",showConfirmButton:!1,showCloseButton:!0})}finally{i(!1)}}};return e.jsxs("div",{className:"relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-blue-400 to-blue-800 animate-gradient-x",children:[e.jsxs("div",{className:"absolute inset-0 z-0 pointer-events-none ",children:[e.jsx("div",{className:"absolute top-0  left-0 w-96 h-96 bg-blue-300 opacity-20 rounded-full blur-3xl animate-pulse"}),e.jsx("div",{className:"absolute bottom-0 right-0 w-96 h-96 bg-purple-300 opacity-20 rounded-full blur-3xl animate-pulse"}),e.jsx("div",{className:"absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-tr from-blue-400 via-purple-300 to-pink-200 opacity-10 rounded-full blur-2xl animate-spin-slow"})]}),e.jsxs(v,{className:"w-full max-w-md md:w-[90%] shadow-2xl rounded-2xl border border-white/30 backdrop-blur-lg bg-white/20 z-10 animate-fade-in-up transition-all duration-700 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:border-blue-300/60",children:[e.jsx(y,{children:e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx("div",{className:"bg-blue-600/80 rounded-full p-4 shadow-lg mb-2",children:e.jsx(m,{icon:w,className:"text-white text-3xl"})}),e.jsx(N,{className:"text-3xl font-bold text-center text-blue-100 drop-shadow-lg",children:"Forgot Password"}),e.jsx(k,{className:"text-center text-base text-blue-100 mt-1",children:"Enter your email to receive a password reset link."})]})}),e.jsx(C,{children:e.jsxs("form",{onSubmit:h,className:"space-y-6",children:[e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsx(S,{className:"text-blue-100",htmlFor:"email",children:"Email"}),e.jsx(E,{id:"email",type:"email",placeholder:"you@example.com",value:a,onChange:r=>n(r.target.value),className:"bg-blue-50/80 h-12 rounded-lg border-2 focus:border-blue-400 transition-all duration-200"}),l&&e.jsx("span",{className:"text-red-500 text-sm",children:l})]}),e.jsxs("div",{className:"flex flex-col space-y-2",children:[e.jsx(x,{type:"submit",disabled:s,className:"w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-2 rounded-lg shadow-lg transition-all duration-200",children:s?e.jsxs(e.Fragment,{children:[e.jsx("span",{children:"Sending..."}),e.jsx("span",{className:"w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"})]}):e.jsx("span",{children:"Send Password Reset Link"})}),e.jsxs(x,{type:"button",variant:"outline",className:"w-full bg-red-500 hover:bg-red-400 text-white hover:text-white",disabled:s,onClick:()=>b("/user-login"),children:[e.jsx(m,{icon:j}),"Back"]})]})]})})]}),e.jsx("style",{children:`
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 10s ease-in-out infinite;
          }
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(40px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.8s cubic-bezier(.39,.575,.565,1) both;
          }
          @keyframes spin-slow {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
          .animate-spin-slow {
            animation: spin-slow 18s linear infinite;
          }
        `})]})}export{z as default};
