class Login extends React.Component {
    constructor(props) {
        super(props);
        //state  값 값을 초기화
        this.state = {
            id: '',
            password: ''
        };
    }

    render() {
        return (
            <div className="imgForm">
                <form action="/account/login" method="post" >
                    <div className="login_form">
                        <div className="id_box">
                            <input type="text" name="userid" placeholder="ID" />
                        </div>
                        <div className="pw_box">
                            <input type="password" onChange={this.handlePasswordChange} name="password" placeholder="PASSWORD" />
                        </div>
                        <input type="submit" value="Login" className="btn1" />
                        <p className="message">Not registered? <a href="/register">Create an account</a></p>
                    </div>
                </form>
            </div>
        )
    }
}
ReactDOM.render(<Login />, document.getElementById('login_form'));