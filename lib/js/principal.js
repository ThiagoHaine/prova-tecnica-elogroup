function processa(form){
    if (!mostraToast(valida())){
        let data = {};
        let inps = document.querySelectorAll("input,select");
        let rs = [];
        
        inps.forEach(inp=>{
            switch(inp.name){
                case "nome":
                case "telefone":
                case "como-conheceu":
                if (inp.value!=""){
                    data[inp.name]=inp.value;
                }
                break;
                case "possui-rede-social":
                data["possui-rede-social"] = document.querySelector("input[name='possui-rede-social']:checked").value;
                break;
                case "rede-social":
                if (inp.checked){
                    rs.push(inp.getAttribute("data-value"));
                }
                break;
            }
        });
        
        if (data["possui-rede-social"]=="sim"){
            data["rede-social"]=rs;
        }
        
        envia(form.action,JSON.stringify(data));
    }
    return false;
}

function envia(url,jsonString){
    let xhr = new XMLHttpRequest();
    
    xhr.open("POST",url,true);
    xhr.setRequestHeader("Content-type", "application/json");
    
    xhr.send(jsonString);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status==200){
                mostraToast(["Enviado com succeso!"]);
                document.getElementById("btnEnviar").disabled=true;
            }else{
                mostraToast(["Falha ao enviar!"]);
            }
        }
    }
}

function mostraToast(arr){
    let toast = document.getElementById("toast");
    toast.className = "accordion fechado";
    
    if (arr.length==0){
        return false;
    }
    
    setTimeout(() => {
        toast.className = "accordion";    
    }, 500);
    
    toast.innerHTML = arr.join("<br>");
    return true;
}

function mostraOpcoes(){
    let  valor=document.querySelector("input[name='possui-rs']:checked").value;
    
    if (valor=="sim"){
        document.getElementById("rs-options").className="accordion";
    }else{
        document.getElementById("rs-options").className="accordion fechado";
    }
}

function valida(){
    let inps = document.querySelectorAll("input,select");
    let resposta = [];
    
    inps.forEach((inp)=>{
        if (inp.value!=""){
            switch(inp.name){
                case "nome":
                if (inp.value.trim().split(" ").length<2){
                    resposta.push("Favor informar nome e sobrenome!");
                }
                break;
                //Pensei em fazer uma máscara forçando o usuário a digitar corretamente, mas, ao meu ver, ai não seria uma validação
                case "telefone":
                let mask = "## - ########";
                let nums = [0,1,2,3,4,5,6,7,8,9];
                
                if ((()=>{
                    if (mask.length!=inp.value.length){
                        return true;
                    }
                    
                    for(let i=0;i<inp.value.length;i++){
                        if (mask[i]=="#"){
                            if (nums.find(a=>a==inp.value[i])==undefined){
                                return true;
                            }
                        }else{
                            if (mask[i]!=inp.value[i]){
                                return true;
                            }
                        }
                    }
                    return false;
                })()){
                    resposta.push("O telefone deve ser informado no seguinte formato: 99 - 99999999");
                    break;
                }
                break;
            }
        }
    });
    
    return resposta;
}