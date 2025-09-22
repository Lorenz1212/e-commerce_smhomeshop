const n=({value:t})=>{const r=typeof t=="string"?parseFloat(t):t;return new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP",minimumFractionDigits:2}).format(r||0)??0};export{n as C};
