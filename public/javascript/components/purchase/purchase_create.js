class List extends React.Component{
    render(){
        
       
        return(
            <form method="post" action="/purchase/create_complete">     
            <input type="hidden" name="designId" value={posts[0]._id}></input>    
            <div className="ProjectIntroduction_ProjectIntroductionBackground">
                <div className="Container">
                    <div className="ProjectIntroduction_ProjectIntroductionWrapper">
                        <div className="ProjectIntroduction_ProjectOutline">
                            <div className="ProjectIntroduction__ProjectOutlineInner-sc-1o2ojgb-3 fFIyMZ">
                                <span className="ProjectIntroduction__ProjectCategory">{posts[0].kinds}</span>
                                <h1 className="ProjectIntroduction__ProjectTitle">
                                <input type="text" name="title" defaultValue= {posts[0].title}/>
                               
                                </h1>
                                <div className="ProjectIntroduction__Creators">
                                    <span className="ProfileImg"></span>
                                    <a className="ProjectIntroduction__CreatorName"
                                    href="https://tumblbug.com/u/dasedewadizokato/projects" target="_blank"
                                    rel="noopener noreferrer">{posts[0].writer.userid}</a>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='ProjectIntroduction__ProjectIntroductionMain_create'>
                        <div className="ProjectIntroduction__ProjectIntroductionMainColumn">

                            <img className="ProjectIntroduction__ProjectCover" alt="기본 프로젝트 커버 이미지" src={posts[0].image}/>
                        </div>
                        <div className="ProjectIntroduction__FundingStatuss">
                            <div className="ProjectIntroduction__Metric">
                                <div className="ProjectIntroduction__StatusTitle">판매 금액</div>
                                <div className="ProjectIntroduction__StatusValue">
                                    <span className="ProjectIntroduction__Small">
                                    <input type="text" name="price" defaultValue= {posts[0].prediction_price}/>&nbsp;<span className="ProjectIntroduction__FundingRate">원</span>
                                    </span>
                                    <span className="ProjectIntroduction__FundingRate"></span>
                                </div>
                            </div>
                           
                            <div className="ProjectIntroduction__Metric">
                                <div className="ProjectIntroduction__StatusTitle">목표 인원</div>
                                <div className="ProjectIntroduction__StatusValue">
                                    <span className="ProjectIntroduction__Small">
                                    <input type="text" name="goal"/> &nbsp;<span className="ProjectIntroduction__FundingRate">명</span>
                                    </span>
                                </div>
                            </div>
                            <div className="FundingInformation">
                                <div className="FundingInformation__FundingInformationInner">

                                    <div>주의사항</div><br/>
                                    <span>
                                        정해진 한달의 기간동안,<br/>
                                        목표인원에 도달하지 못하면 펀딩취소가 됩니다.
                                    </span>
                                </div>
                            </div>
                            <div className="ProjectIntroduction__ProjectButtons-sc-1o2ojgb-19 fHOYOE">
                                <div className="ProjectIntroduction__ProjectButtonsInner-sc-1o2ojgb-20 frPGIq">
                                    <div className="ProjectIntroduction__PrimaryButton-sc-1o2ojgb-21 lcgtza">
                                    <input className="Button-sc" type="submit" value="작성완료"/>
                                    </div>
                                   
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </form>
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
ReactDOM.render(<Design_list />, document.getElementById('design_list_container'));

 // React.createElement(component, props, ...children)
//ReactDOM.render(element, container[, callback]) 