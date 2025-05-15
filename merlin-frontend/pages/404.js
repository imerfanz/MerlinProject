import st from '@/styles/404.module.css';
import { IBM , noto , rubik , protest} from '@/config/fonts';


export default function F404(){
    return(
        <main className={st.main}>
            <div className={IBM.className}>
                <pre className={protest.className}>404</pre>
                <p>صفحه مورد نظر یافت نشد</p>
            </div>
        </main>
    )
}