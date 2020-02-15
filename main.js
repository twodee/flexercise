Array.prototype.pick = function() {
  const i = Math.floor(Math.random() * this.length);
  return this[i];
};

let expectedState = {};
let actualState = {};

function initialize() {
  const randomizeButton = document.getElementById('randomize-button');
  const expectedPanel = document.getElementById('expected');
  const actualPanel = document.getElementById('actual');
  const panelsRoot = document.getElementById('panels-root');
  const flexDirectionInput = document.getElementById('flex-direction-input');
  const justifyContentInput = document.getElementById('justify-content-input');
  const alignItemsInput = document.getElementById('align-items-input');
  const isRightCheckbox = document.getElementById('is-right-checkbox');

  const flexDirectionOptions = ['row', 'column', 'row-reverse', 'column-reverse'];
  const justifyContentOptions = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'];
  const alignItemsOptions = ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'];

  randomizeButton.addEventListener('click', () => {
    expectedState = {
      'justify-content': justifyContentOptions.pick(),
      'align-items': alignItemsOptions.pick(),
      'flex-direction': flexDirectionOptions.pick(),
    };

    expectedPanel.style['flex-direction'] = expectedState['flex-direction'];
    expectedPanel.style['justify-content'] = expectedState['justify-content'];
    expectedPanel.style['align-items'] = expectedState['align-items'];
    panelsRoot.style['flex-direction'] = expectedState['flex-direction'].startsWith('row') ? 'column' : 'row';
    isRightCheckbox.checked = isRight();
  });

  const initialStyle = getComputedStyle(actualPanel);
  actualState = {
    'flex-direction': initialStyle['flex-direction'],
    'justify-content': initialStyle['justify-content'],
    'align-items': initialStyle['align-items'],
  };
  flexDirectionInput.value = actualState['flex-direction'];
  justifyContentInput.value = actualState['justify-content'];
  alignItemsInput.value = actualState['align-items'];

  flexDirectionInput.addEventListener('input', () => {
    actualState['flex-direction'] = flexDirectionInput.value;
    if (flexDirectionOptions.includes(actualState['flex-direction'])) {
      actualPanel.style['flex-direction'] = actualState['flex-direction'];
    }
    isRightCheckbox.checked = isRight();
  });

  justifyContentInput.addEventListener('input', () => {
    actualState['justify-content'] = justifyContentInput.value;
    if (justifyContentOptions.includes(actualState['justify-content'])) {
      actualPanel.style['justify-content'] = actualState['justify-content'];
    }
    isRightCheckbox.checked = isRight();
  });

  alignItemsInput.addEventListener('input', () => {
    actualState['align-items'] = alignItemsInput.value;
    if (alignItemsOptions.includes(alignItemsInput.value)) {
      actualPanel.style['align-items'] = alignItemsInput.value;
    }
    isRightCheckbox.checked = isRight();
  });
}

function isRight() {
  console.log("expectedState:", expectedState);
  console.log("actualState:", actualState);
  return expectedState['flex-direction'] === actualState['flex-direction'] &&
         expectedState['justify-content'] === actualState['justify-content'] &&
         expectedState['align-items'] === actualState['align-items'];
}

window.addEventListener('load', initialize);
