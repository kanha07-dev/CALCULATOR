
    // Calculator logic
    const valueEl = document.getElementById('value');
    const subEl = document.getElementById('subvalue');
    const histEl = document.getElementById('history');

    let current = '0';
    let previous = null;
    let operator = null;
    let waitingForNew = false;

    function updateDisplay(){
      valueEl.textContent = current;
      subEl.textContent = operator ? `${previous ?? ''} ${operator}` : '\u00A0';
      histEl.textContent = '';
    }

    function inputNumber(n){
      if(waitingForNew){ current = n === '.' ? '0.' : n; waitingForNew = false; }
      else if(current === '0' && n !== '.') current = n;
      else if(n === '.' && current.includes('.')) return;
      else current = current + n;
      updateDisplay();
    }

    function clearAll(){ current = '0'; previous = null; operator = null; waitingForNew = false; updateDisplay(); }

    function applyOperator(op){
      const c = parseFloat(current);
      if(previous === null){ previous = c; }
      else if(operator){
        previous = compute(previous, operator, c);
      }
      operator = op === '=' ? null : op;
      current = String(previous);
      waitingForNew = true;
      updateDisplay();
    }

    function compute(a, op, b){
      switch(op){
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b === 0 ? NaN : a / b;
      }
      return b;
    }

    function toggleNeg(){
      if(current === '0') return;
      current = String(parseFloat(current) * -1);
      updateDisplay();
    }

    function percent(){
      current = String(parseFloat(current) / 100);
      updateDisplay();
    }

    // Button handling
    document.querySelectorAll('button.key').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const num = btn.dataset.num;
        const act = btn.dataset.action;
        if(num !== undefined) inputNumber(num);
        else if(act) handleAction(act);
      });
    });

    function handleAction(act){
      if(act === 'clear'){ clearAll(); return; }
      if(act === 'neg'){ toggleNeg(); return; }
      if(act === 'percent'){ percent(); return; }
      if(act === '='){ applyOperator('='); return; }
      // + - * /
      if(['+','-','*','/'].includes(act)){
        if(waitingForNew && operator) operator = act; // replace operator
        else applyOperator(act);
      }
    }

    // Keyboard support
    window.addEventListener('keydown', e=>{
      if(e.key >= '0' && e.key <= '9') inputNumber(e.key);
      else if(e.key === '.') inputNumber('.');
      else if(e.key === 'Enter' || e.key === '=') handleAction('=');
      else if(e.key === 'Backspace'){
        if(current.length <= 1) current = '0'; else current = current.slice(0,-1);
        updateDisplay();
      }
      else if(e.key === '+') handleAction('+');
      else if(e.key === '-') handleAction('-');
      else if(e.key === '*') handleAction('*');
      else if(e.key === '/') handleAction('/');
      else if(e.key === '%') handleAction('percent');
    });

    // Initialize
    clearAll();
  