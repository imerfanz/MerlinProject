import st from "@/styles/editUser.module.css";

export default function EditUser(props) {
  return (
    <section>
      <form
        className={`${st.f1} ${IBM.className}`}
        style={f1Disp}
        onSubmit={handleSubmit(form1submit)}
      >
        <div>
          <input
            type="text"
            placeholder="نام"
            className={IBM.className}
            {...register("name", { required: "این قسمت را پر کنید" })}
          />
          <p className={st.errors}>{errors.name && errors.name.message}</p>
        </div>
        <div>
          <input
            type="text"
            placeholder="نام خانوادگی"
            className={IBM.className}
            {...register("lastname", { required: "این قسمت را پر کنید" })}
          />
          <p className={st.errors}>
            {errors.lastname && errors.lastname.message}
          </p>
        </div>
        <div>
          <select style={{ color: "#001022b9" }} className={IBM.className}>
            <optgroup label="انتخاب استان ...">
              <option value="Tehran">تهران</option>
              <option value="Isfahan">اصفهان</option>
              <option value="Fars">فارس</option>
              <option value="Khuzestan">خوزستان</option>
              <option value="Kerman">کرمان</option>
              <option value="Mazandaran">مازندران</option>
              <option value="Gilan">گیلان</option>
              <option value="Golestan">گلستان</option>
              <option value="Semnan">سمنان</option>
              <option value="Qazvin">قزوین</option>
              <option value="Alborz">البرز</option>
              <option value="Markazi">مرکزی</option>
              <option value="Hamadan">همدان</option>
              <option value="Zanjan">زنجان</option>
              <option value="Ardabil">اردبیل</option>
              <option value="Azerbaijan Eastern">آذربایجان شرقی</option>
              <option value="Azerbaijan Western">آذربایجان غربی</option>
              <option value="Kurdistan">کردستان</option>
              <option value="Kermanshah">کرمانشاه</option>
              <option value="Ilam">ایلام</option>
              <option value="Lorestan">لرستان</option>
              <option value="Chaharmahal and Bakhtiari">
                چهارمحال و بختیاری
              </option>
              <option value="Kohgiluyeh and Boyer-Ahmad">
                کهگیلویه و بویراحمد
              </option>
              <option value="Bushehr">بوشهر</option>
              <option value="Hormozgan">هرمزگان</option>
              <option value="Sistan and Baluchestan">سیستان و بلوچستان</option>
              <option value="Yazd">یزد</option>
            </optgroup>
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder="نام شهر"
            className={IBM.className}
            {...register("city", { required: "این قسمت را پر کنید" })}
          />
          <p className={st.errors}>{errors.city && errors.city.message}</p>
        </div>
        <div>
          <input
            type="password"
            placeholder="رمز عبور"
            {...register("password", {
              required: "این قسمت را پر کنید",
              minLength: {
                value: 8,
                message: "رمز عبور باید حداقل ۸ کاراکتر باشد",
              },
            })}
          />
          <p className={st.errors}>
            {errors.password && errors.password.message}
          </p>
        </div>
        <div>
          <input
            type="password"
            placeholder="تکرار رمز عبور"
            {...register("password2", {
              required: "این قسمت را پر کنید",
              minLength: {
                value: 8,
                message: "رمز عبور باید حداقل ۸ کاراکتر باشد",
              },
            })}
          />
          <p className={st.errors}>
            {errors.password2 && errors.password2.message}
          </p>
        </div>
        <div>
          <input
            type="text"
            placeholder="ایمیل"
            className={IBM.className}
            id={st.email}
            {...register("email", {
              required: "این قسمت را پر کنید",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "ایمیل صحیح نمی باشد",
              },
            })}
          />
          <p className={st.errors}>{errors.email && errors.email.message}</p>
        </div>
        <div>
          <input
            type="text"
            placeholder="تلفن همراه"
            className={IBM.className}
            id={st.phone}
            {...register("phone", {
              required: "این قسمت را پر کنید",
              pattern: {
                value: /^09\d{9}$/,
                message: "تلفن همراه صحیح نمیباشد ",
              },
            })}
          />
          <p className={st.errors}>{errors.phone && errors.phone.message}</p>
        </div>
        <div>
          <input
            type="text"
            placeholder="کد پستی (مثال: 13375-23456)"
            id={st.postcode}
            className={IBM.className}
            {...register("postcode", {
              required: "این قسمت را پر کنید",
              pattern: {
                value: /^\d{5}-\d{5}$/,
                message: "کد پستی وارد شده صحیح نیست (مثال: 13375-23456)",
              },
            })}
          />
          <p className={st.errors}>
            {errors.postcode && errors.postcode.message}
          </p>
        </div>
        <div>
          <textarea
            type="textarea"
            placeholder="آدرس منزل (مثال: خیابان/کوچه/پلاک/واحد)"
            id={st.address}
            className={IBM.className}
            {...register("address", { required: "این قسمت را پر کنید" })}
          />
          <p className={st.errors}>
            {errors.address && errors.address.message}
          </p>
        </div>
        <input type="submit" value={"ثبت نام"} className={IBM.className} />
      </form>
    </section>
  );
}
