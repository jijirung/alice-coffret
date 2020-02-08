class List extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            file: null
        }
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(event) {
        this.setState({
            file: URL.createObjectURL(event.target.files[0])
        })
    }

    render(){
        var design_form = {
            width: '720px',
            margin: '0 auto',
            overflow: 'auto'
        }
        var profile_image = {
            backgroundColor : '#F6F6F6',
            border: '1px solid black', 
            width: '202px',
            height: '270px',
            float: 'left',
            margin: '40px 20px 20px 20px',
            textAlign:'center',
            fontWeight: '800'                         
        }
        var image = {
            width: '198px',
            height: '230px',

        }
        var design_information = {
            float: 'left',
            margin: '20px',
            fontFamily: 'Nanum Gothic',
            fontSize: '10px',
        }

        var file_input = {
            display: 'none'
        }

        var row = {
            fontWeight: 800,
            paddingRight: '25px',
        }
        var input_title = {
            width: '570px',
            height: '30px',
            fontSize: '10px',
            paddingLeft: '9px'
        }
        var input_money = {
            width: '130px',
            height: '30px',
            fontSize: '10px',
            paddingLeft: '9px'
        }
        var td_money = {
            fontWeight: 800,
            textAlign: 'left',
            fontSize: '12px'

        }
        var td_warning = {
            fontWeight: 800,
            fontSize: '11px'
        }
       
        var table = {
            borderCollapse: 'separate',
            borderSpacing: '0 20px'
        }
        var textarea = {
            width: '578px',
            height: '107px',
            padding: '10px',
            marginTop: '10px'
        }
        var design_explanation = {
            fontWeight: 800,
            verticalAlign: 'top'
        }
        var btn_style = {     
            clear: 'both',
            float: 'center',
            width: '240px',
            margin: '0 auto',
            padding: '0',
            color: '#ffffff',
            border: '0'
        }
        var btn_cancel = {
            fontWeight: 800,
            backgroundColor: '#BDBDBD',
            width: '90px',
            height: '42px',
            padding: '1px 6px',
            color: '#ffffff',
            float: 'left',
            border: '0px',
            borderRadius: '12px',
            display: 'table',                  
        }
        var btn_cancel_link = {
            display: 'table-cell',
            textAlign: 'center',
            verticalAlign: 'middle',
            color: '#ffffff'
        }

        var btn_submit = {
            fontWeight: 800,
            backgroundColor: '#F15F5F',
            width: '90px',
            height: '42px',
            padding: '1px 6px',
            color: '#ffffff',
            float: 'right',
            border: '0px',
            borderRadius: '12px'
        }

        return(        
            <div style={design_form}>
                 <form method="post" action="/design/modify_ok">
                    <input type="hidden" value={posts[0]._id} name="designId"></input>
                    <div id="design_information" style={design_information}>
                        <table style={table}>
                            <tr>
                                <td  style ={row}>작품제목</td>
                                <td colSpan="6"><input type="text" style={input_title} name="title" defaultValue= {posts[0].title}/></td>        
                            </tr>
                            <tr>
                                <td  style ={row}>예상가</td>
                                <td colSpan="5" style={td_money} ><input type="text" style={input_money} name="prediction_price" defaultValue= {posts[0].prediction_price}/> &nbsp; 원</td>                           
                            </tr>
                            <tr>
                                <td colSpan="6" style={td_warning}>※ 판매자격이 주어지는 경우 예상가의 10%만 인상가능합니다.</td>      
                            </tr>
                            <tr>
                                <td style ={row, design_explanation}> 작품설명</td>
                                <td colSpan="5" rowSpan="5"><textarea style={textarea} name="contents" defaultValue= {posts[0].contents}></textarea></td>
                            </tr>
                        </table>               
                    </div>  
                    <div style={btn_style}>
                         <div style={btn_cancel}><a style={btn_cancel_link} href="/design"> 취소 </a></div>
                        <input style={btn_submit} type="submit" value="수정"/>
                    </div>
                </form>
            </div>
            
        );
    }
}

                      
function Design_list() {
    return(
        <div classNameName="App">
            <List></List>                          
        </div>
    );
}
ReactDOM.render(<Design_list />, document.getElementById('design_modify_container'));

 // React.createElement(component, props, ...children)
//ReactDOM.render(element, container[, callback]) 